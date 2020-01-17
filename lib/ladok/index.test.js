/** Test example */
const ladok = require('.')
const test = require('ava')

test('getArbetsUnderlag works properly', t => {
  const r = {
    ResultatPaUtbildningar: [
      {
        Arbetsunderlag: {
          UtbildningsinstansUID: 'XXXX'
        }
      }
    ]
  }

  const u = ladok.getArbetsUnderlag(r, 'XXXX')
  t.deepEqual(u, { UtbildningsinstansUID: 'XXXX' })
})
