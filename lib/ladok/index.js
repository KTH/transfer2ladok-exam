const ladokApi = require('./api')
const log = require('skog')
const memoizee = require('memoizee')

/** Get the "ArbetsUnderlag" of a "Ladok Resultat" related to a module */
function getArbetsUnderlag (result, moduleId) {
  const underlag = result.ResultatPaUtbildningar.map(rpu => rpu.Arbetsunderlag)

  return underlag.find(au => au && au.UtbildningsinstansUID === moduleId)
}

/** Get all "Betygskalor" in Ladok without caching */
async function listScalesRaw () {
  log.info('Getting Betygskalor from Ladok')
  return ladokApi
    .get('/resultat/grunddata/betygsskala')
    .then(r => r.Betygsskala)
}

/** Get all "Betygskalor" in Ladok */
const listScales = memoizee(listScalesRaw, { maxAge: 3600 * 1000 })

/** Get the "Betyg ID" of a "letter" */
async function getGradeId (scaleId, letterGrade) {
  const allScales = await listScales()

  const scale = allScales.find(s => parseInt(s.ID, 10) === scaleId)

  if (!scale) {
    throw new Error(`Grading scale "${scaleId}" not found in Ladok`)
  }

  const grade = scale.Betygsgrad.find(
    g => g.Kod && g.Kod.toUpperCase() === letterGrade.toUpperCase()
  )

  if (!grade) {
    throw new Error(
      `Grade "${letterGrade}" not found in grading scale ${scaleId}`
    )
  }

  return grade && grade.ID
}

/** Get all the ladok reporters without caching */
async function listReportersRaw () {
  const response = await ladokApi.get(
    `/kataloginformation/behorighetsprofil/${process.env.LADOK_REPORTER_PROFILE_UID}/koppladeanvandare`
  )

  const users = {}
  response.Anvandare.forEach(user => {
    users[user.Anvandarnamn] = {
      Uid: user.Uid,
      Fornamn: user.Fornamn,
      efternamn: user.Efternamn
    }
  })

  return users
}

/** Get all Ladok reporters */
const listReporters = memoizee(listReportersRaw, {
  maxAge: 15 * 60 * 1000
})

/** Get a list of "Resultat" in Ladok that can be created or updated */
async function listGradeableResults (sectionId, moduleId) {
  return ladokApi
    .sok(
      `/resultat/studieresultat/rapportera/utbildningsinstans/${moduleId}/sok`,
      {
        Filtrering: ['OBEHANDLADE', 'UTKAST'],
        KurstillfallenUID: [sectionId],
        LarosateID: process.env.LADOK_KTH_LAROSATE_ID,
        OrderBy: ['EFTERNAMN_ASC', 'FORNAMN_ASC', 'PERSONNUMMER_ASC'],
        UtbildningsinstansUID: moduleId
      },
      'Resultat'
    )
    .toArray()
}

/** Returns a blank "Draft" object that can be sent to ladok */
function createDraft (moduleId) {
  const resultsForCreate = []
  const resultsForUpdate = []

  return {
    /** Set a grade (letter) and examination date into a result (Resultat) */
    async setGrade (result, grade, examinationDate) {
      if (!grade) {
        return
      }

      const underlag = getArbetsUnderlag(result, moduleId)
      const newLadokGrade = await getGradeId(
        result.Rapporteringskontext.BetygsskalaID,
        grade
      )

      // Check if the current grade is the same as the new one
      if (underlag && underlag.Betygsgrad === newLadokGrade) {
        log.info(
          `Student ${result.Student.Uid}. SAME GRADE. Before: ${newLadokGrade}. After: ${newLadokGrade}`
        )
        return
      }

      if (!underlag) {
        // Create
        log.info(
          `Student ${result.Student.Uid}. Before: ---. After: ${newLadokGrade} ex.date ${examinationDate}`
        )

        resultsForCreate.push({
          Uid: result.Uid,
          StudieresultatUID: result.Uid,
          UtbildningsinstansUID:
            result.Rapporteringskontext.UtbildningsinstansUID,
          Betygsgrad: newLadokGrade,
          BetygsskalaID: result.Rapporteringskontext.BetygsskalaID,
          Examinationsdatum: examinationDate
        })
      } else {
        log.info(
          `Student ${result.Student.Uid}. Before: ${underlag.Betygsgrad}. After: ${newLadokGrade} ex.date ${examinationDate}`
        )
        // Update
        resultsForUpdate.push({
          Uid: result.Student.Uid,
          ResultatUID: underlag.Uid,
          Betygsgrad: newLadokGrade,
          BetygsskalaID: result.Rapporteringskontext.BetygsskalaID,
          Examinationsdatum: examinationDate,
          SenasteResultatandring: underlag.SenasteResultatandring
        })
      }
    },

    /** Get the object to be sent to Ladok for creating grades as Draft */
    bodyForCreate () {
      return {
        LarosateID: process.env.LADOK_KTH_LAROSATE_ID,
        Resultat: resultsForCreate
      }
    },

    /** Get the object to be sent to Ladok for updating grades as Draft */
    bodyForUpdate () {
      return {
        Resultat: resultsForUpdate
      }
    }
  }
}

/** Send a Draft to Ladok */
async function sendDraft (draft) {
  const update = draft.bodyForUpdate()

  log.info(`Grades to be updated: ${update.Resultat.length}`)

  if (update.Resultat.length > 0) {
    await ladokApi.requestUrl(
      '/resultat/studieresultat/uppdatera',
      'PUT',
      update
    )
  }

  const create = draft.bodyForCreate()
  log.info(`Grades to be created: ${create.Resultat.length}`)

  if (create.Resultat.length > 0) {
    await ladokApi.requestUrl('/resultat/studieresultat/skapa', 'POST', create)
  }
}

module.exports = {
  listScales,
  listGradeableResults,
  listReporters,
  getArbetsUnderlag,
  getGradeId,
  createDraft,
  sendDraft
}
