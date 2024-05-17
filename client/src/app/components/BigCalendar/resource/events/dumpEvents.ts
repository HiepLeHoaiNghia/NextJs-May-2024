import { RequestStatus } from '~/app/core/enums'

const events = [
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2024, 3, 7),
    end: new Date(2024, 3, 10)
  },

  {
    id: 27,
    title: 'DST starts on this day (Europe)',
    start: new Date(2023, 2, 26, 0, 0, 0),
    end: new Date(2023, 2, 26, 4, 30, 0)
  }
]

const randomTitles = ['Meeting', 'Conference', 'Workshop', 'Training', 'Presentation']

const modifiedEvents = events.map((event) => ({
  ...event,
  requestType: Math.floor(Math.random() * 5), // Random number between 0 and 4
  title: randomTitles[Math.floor(Math.random() * randomTitles.length)], // Random title from the array
  requestStatus: Math.floor((Math.random() * Object.keys(RequestStatus).length) / 2) // Random status
}))

const startHour = 8
const startMinute = 30
const endMinute = 30

const startDate = new Date(2024, 3, 1) // April 1st
const endDate = new Date(2024, 6, 31) // July 31st

let currentId = events.length + 1

for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
  const numberOfEvents = Math.floor(Math.random() * 7) // Random number between 0 and 6

  for (let i = 0; i < numberOfEvents; i++) {
    const startDateTime = new Date(date)
    startDateTime.setHours(startHour + i, startMinute)

    const endDateTime = new Date(date)
    endDateTime.setHours(startHour + i + 1, endMinute)

    modifiedEvents.push({
      id: currentId++,
      title: randomTitles[Math.floor(Math.random() * randomTitles.length)],
      start: startDateTime,
      end: endDateTime,
      requestType: Math.floor(Math.random() * 5), // Random number between 0 and 4
      requestStatus: Math.floor((Math.random() * Object.keys(RequestStatus).length) / 2) // Random status
    })
  }
}

export default modifiedEvents
