
import store from '../utils/store';
import moment from 'moment'

export const getLocalStream = async () => {
  const dispatch = store.dispatch
  const { filterString } = store.getState()
  const {startTime, endTime, startDate, endDate} = filterString
  if (startTime && endTime && startDate && endDate) {
    let startTimeHours = new Date(moment(startTime, "hh:mm A")).getHours()
    let endTimeHours = new Date(moment(endTime, "hh:mm A")).getHours()
    let startDateHours = moment(startDate).add(startTimeHours, 'hours')
    let endDateHours = moment(endDate).add(endTimeHours, 'hours')
    var estHours = (endTimeHours - startTimeHours) + (endDateHours - startDateHours);
    const settingHours = Math.trunc(estHours / 3600000)
    dispatch({ type: "HOURSCOUNT", payload: settingHours })
    let dayCountMult = 1
    if (settingHours > 24) {
      dayCountMult = Math.trunc(settingHours / 24)
      if (settingHours % 24 > 0) {
        dayCountMult = (Math.trunc(settingHours / 24) + 1)
      }
    }
    dispatch({ type: "DAYSCOUNT", payload: dayCountMult })
  }
};