const Canvas = require('@kth/canvas-api')
const log = require('skog')
const ladok = require('./ladok-api')
const { isAllowed } = require('./is-allowed')

class ExportError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
    this.name = 'ExportError'
  }
}

async function getSubmissions (canvas, courseId, assignmentId) {
  const params = { student_ids: ['all'], include: ['user'] }
  return canvas
    .list(`courses/${courseId}/assignments/${assignmentId}/submissions`, params)
    .toArray()
}

const matchWithSubmissions = submissions => ladokResult => {
  const submission = submissions.find(
    s => ladokResult.Student.Uid === s.user.integration_id
  )

  return submission ? { ...ladokResult, submission } : null
}

const combineResults = (ladokResults, canvasResults) =>
  ladokResults.map(matchWithSubmissions(canvasResults)).filter(r => r)

const getArbetsUnderlag = modulUID => result => {
  const underlag = result.ResultatPaUtbildningar.map(rpu => rpu.Arbetsunderlag)

  return underlag.find(au => au && au.UtbildningsinstansUID === modulUID)
}

const getBetyg = skalor => (skalaID, grade) => {
  const grader = skalor.find(s => parseInt(s.ID, 10) === skalaID).Betygsgrad

  return grader.find(g => g.Kod && g.Kod.toUpperCase() === grade.toUpperCase())
    .ID
}

const modifiedResults = (getAU, getB) => result => {
  const canvasGrade = getB(
    result.Rapporteringskontext.BetygsskalaID,
    result.submission.grade
  )
  const ladokGrade = getAU(result).Betygsgrad
  return canvasGrade !== ladokGrade
}

async function getLadokResults (modulUID, kurstillfallenUID) {
  return ladok
    .sok(
      `/resultat/studieresultat/rapportera/utbildningsinstans/${modulUID}/sok`,
      {
        Filtrering: ['OBEHANDLADE', 'UTKAST'],
        KurstillfallenUID: kurstillfallenUID,
        LarosateID: process.env.LADOK_KTH_LAROSATE_ID,
        OrderBy: ['EFTERNAMN_ASC', 'FORNAMN_ASC', 'PERSONNUMMER_ASC'],
        UtbildningsinstansUID: modulUID
      },
      'Resultat'
    )
    .toArray()
}

module.exports = {
  async sendGradesToLadok (
    courseId,
    assignmentId,
    ladokModuleId,
    examinationDate,
    token
  ) {
    log.info(`From course ${courseId}, assignment ${assignmentId} to module ${ladokModuleId}`)
    const canvas = Canvas(`${process.env.CANVAS_HOST}/api/v1`, token)
    const allowed = await isAllowed(canvas, courseId)

    if (!allowed) {
      throw new ExportError(
        'not_allowed',
        'The user is not allowed to send grades to Ladok'
      )
    }

    const sections = (
      await canvas.list(`courses/${courseId}/sections`).toArray()
    )
      .filter(s => s.integration_id)
      .map(s => s.integration_id)

    if (sections.length === 0) {
      return
    }

    const betygsSkalor = await ladok
      .get('/resultat/grunddata/betygsskala')
      .then(r => r.Betygsskala)


    const canvasResults = (
      await getSubmissions(canvas, courseId, assignmentId)
    ).filter(s => s.grade)

    const ladokResults = await getLadokResults(ladokModuleId, sections)
    const combinedResults = combineResults(ladokResults, canvasResults)

    log.info(
      `Ladok results for assignment id ${assignmentId}:`,
      ladokResults.length
    )

    const getAU = getArbetsUnderlag(ladokModuleId)
    const getB = getBetyg(betygsSkalor)

    const resultsWithAU = combinedResults
      .filter(getAU)
      .filter(modifiedResults(getAU, getB))

    const resultsWithoutAU = combinedResults.filter(r => !getAU(r))

    log.info(
      `Results to be updated: ${resultsWithAU.length}. Results to be created: ${resultsWithoutAU.length}`
    )

    if (resultsWithAU.length > 0) {
      await ladok.requestUrl('/resultat/studieresultat/uppdatera', 'PUT', {
        Resultat: resultsWithAU.map(r => ({
          Uid: r.Student.Uid,
          ResultatUID: getAU(r).Uid,
          Betygsgrad: getB(
            r.Rapporteringskontext.BetygsskalaID,
            r.submission.grade
          ),
          BetygsskalaID: r.Rapporteringskontext.BetygsskalaID,
          Examinationsdatum: examinationDate,
          SenasteResultatandring: getAU(r).SenasteResultatandring
        }))
      })
    }

    if (resultsWithoutAU.length > 0) {
      await ladok.requestUrl('/resultat/studieresultat/skapa', 'POST', {
        LarosateID: process.env.LADOK_KTH_LAROSATE_ID,
        Resultat: resultsWithoutAU.map(r => ({
          Uid: r.Uid,
          StudieresultatUID: r.Uid,
          UtbildningsinstansUID: r.Rapporteringskontext.UtbildningsinstansUID,
          Betygsgrad: getB(
            r.Rapporteringskontext.BetygsskalaID,
            r.submission.grade
          ),
          BetygsskalaID: r.Rapporteringskontext.BetygsskalaID,
          Examinationsdatum: examinationDate
        }))
      })
    }

    return true
  }
}
