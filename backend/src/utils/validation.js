export const required = fields => body => fields.filter(field => !body[field]);
export const allowedStatuses = ['New', 'Matching', 'Quoted', 'Scheduled', 'In progress', 'Completed', 'Cancelled'];
