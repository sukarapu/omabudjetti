import styles from './Stats.module.scss'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { LabelList, Legend, Pie, PieChart } from 'recharts'
import randomColor from 'randomcolor'

/**
 * Näyttää kulutustiedoista muodostetut tilastot kaavioina.
 *
 * Komponentti muodostaa annetusta datasta kaksi visualisointia:
 * - viivakaavion maksujen summista päivämäärittäin
 * - piirakkakaavion maksujen summista kulutyypeittäin
 *
 * Lisäksi komponentti muotoilee euromäärät ja päivämäärät
 * suomen lokaaliasetusten mukaisesti.
 *
 * @param {Object} props - Komponentille välitettävät propsit.
 * @param {Array<Object>} props.data - Tilastoitavat kulurivit.
 * @param {string} props.data[].paymentDate - Maksun päivämäärä.
 * @param {number} props.data[].amount - Maksettu summa euroina.
 * @param {string} props.data[].type - Kulun tyyppi.
 * @returns {JSX.Element} Tilastonäkymä, joka sisältää viiva- ja piirakkakaavion.
 */
function Stats(props) {

    const locale = "fi-FI"
    const numberFormat = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" })

    const reducer = (resultData, item, key) => {
        const index = resultData.findIndex(arrayItem => arrayItem[key] === item[key])
        if (index >= 0) {
            resultData[index].amount = resultData[index].amount + item.amount
        } else {
            resultData.push({[key]: item[key], amount: item.amount})
        }
        return resultData
    }

    const reduceByPaymentDate = (resultData, item) => {
        return reducer(resultData, item, 'paymentDate')
    }

    const reduceByType = (resultData, item) => {
        return reducer(resultData, item, 'type')
    }

    const piedata = props.data.reduce(reduceByType, [])

    const linedata = props.data.reduce(reduceByPaymentDate, [])
                               .map(
                                 (item) => ({
                                   date: new Date(item.paymentDate).getTime(),
                                   amount: item.amount
                                 })
                               )

    const piecolors = randomColor({ count: piedata.length,
                                    seed: 'siemenluku',
                                    luminosity: 'dark' })

    const pieWithColors = piedata.map((item, index) => ({
        ...item,
        fill: piecolors[index]
    }))

    return (
        <div className={styles.stats}>
          <h2>Tilastot</h2>

          { props.data.length ? <>

          <h3>Kulut aikajanalla</h3>
          <ResponsiveContainer height={350}>
              <LineChart data={linedata}>
                  <XAxis dataKey="date"
                         tickFormatter={(value) => new Date(value).toLocaleDateString(locale)} />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString(locale)}
                           formatter={(value) => numberFormat.format(value)} />
                  <Line type="monotone" dataKey="amount" dot={false} />
              </LineChart>
          </ResponsiveContainer>
          <h3>Kulut kulutyypeittäin</h3>
          <ResponsiveContainer height={400}>
              <PieChart>
                  <Pie data={pieWithColors} dataKey='amount' nameKey='type'>
                      <LabelList dataKey='amount'
                                 position='inside'
                                 fill='white'
                                 formatter={
                                   value => numberFormat.format(value)
                                 } />
                  </Pie>
                  <Legend />
                  <Tooltip formatter={ value => numberFormat.format(value) } />
              </PieChart>
          </ResponsiveContainer>
          </> : <div className={styles.stats_empty}>Tilastotietoja ei ole saatavilla. Syötä kulutietoja.</div> }
        </div>
    )
}

export default Stats
