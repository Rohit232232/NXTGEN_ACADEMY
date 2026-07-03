const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  type: { type: String, default: 'contact' },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  email: { type: String, required: true, trim: true, maxlength: 200 },
  phone: { type: String, trim: true, default: '' },
  message: { type: String, trim: true, default: '', maxlength: 4000 },
}, {
  timestamps: true, // adds createdAt / updatedAt automatically
});

module.exports = mongoose.model('Submission', submissionSchema);