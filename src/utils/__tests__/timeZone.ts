import { offsetToUTC } from '../timeZone'

it('timeZoneNameToUTC', () => {
    expect(offsetToUTC(30)).toEqual('UTC-0:30')
    expect(offsetToUTC(-480)).toEqual('UTC+8')
    expect(offsetToUTC(0)).toEqual('UTC')
})
