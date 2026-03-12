const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        unique: true,
        trim: true,
        enum: ['superadmin', 'admin', 'manager', 'field_officer', 'viewer']
    },
    permissions: [{
        type: String,
        enum: [
            'users:read', 'users:write', 'users:delete',
            'farmers:read', 'farmers:write', 'farmers:delete',
            'plots:read', 'plots:write', 'plots:delete',
            'submissions:read', 'submissions:write', 'submissions:verify',
            'images:read', 'images:write', 'images:delete',
            'reports:read', 'reports:write', 'reports:export',
            'ai:analyze', 'ai:read',
            'notifications:read', 'notifications:write',
            'settings:read', 'settings:write'
        ]
    }],
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Static method to initialize default roles
roleSchema.statics.initializeRoles = async function () {
    const defaultRoles = [
        {
            name: 'superadmin',
            permissions: ['users:read', 'users:write', 'users:delete', 'farmers:read', 'farmers:write', 'farmers:delete', 'plots:read', 'plots:write', 'plots:delete', 'submissions:read', 'submissions:write', 'submissions:verify', 'images:read', 'images:write', 'images:delete', 'reports:read', 'reports:write', 'reports:export', 'ai:analyze', 'ai:read', 'notifications:read', 'notifications:write', 'settings:read', 'settings:write'],
            description: 'Full system access'
        },
        {
            name: 'admin',
            permissions: ['users:read', 'users:write', 'farmers:read', 'farmers:write', 'plots:read', 'plots:write', 'submissions:read', 'submissions:write', 'submissions:verify', 'images:read', 'images:write', 'reports:read', 'reports:write', 'reports:export', 'ai:analyze', 'ai:read', 'notifications:read', 'notifications:write', 'settings:read'],
            description: 'Administrative access without user deletion'
        },
        {
            name: 'manager',
            permissions: ['farmers:read', 'farmers:write', 'plots:read', 'plots:write', 'submissions:read', 'submissions:write', 'submissions:verify', 'images:read', 'images:write', 'reports:read', 'reports:write', 'reports:export', 'ai:analyze', 'ai:read', 'notifications:read'],
            description: 'Can manage farmers and verify submissions'
        },
        {
            name: 'field_officer',
            permissions: ['farmers:read', 'farmers:write', 'plots:read', 'plots:write', 'submissions:read', 'submissions:write', 'images:read', 'images:write', 'ai:analyze', 'notifications:read'],
            description: 'Field data collection and submission'
        },
        {
            name: 'viewer',
            permissions: ['farmers:read', 'plots:read', 'submissions:read', 'images:read', 'reports:read', 'ai:read', 'notifications:read'],
            description: 'Read-only access'
        }
    ];

    for (const role of defaultRoles) {
        await this.findOneAndUpdate(
            { name: role.name },
            role,
            { upsert: true, new: true }
        );
    }
};

module.exports = mongoose.model('Role', roleSchema);