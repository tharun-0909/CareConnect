import Booking from '../models/Booking.js';

export async function hasBookingConflict(provider, startsAt, endsAt) { return Boolean(await Booking.exists({ provider, status: { $ne: 'Cancelled' }, startsAt: { $lt: new Date(endsAt) }, endsAt: { $gt: new Date(startsAt) } })); }
