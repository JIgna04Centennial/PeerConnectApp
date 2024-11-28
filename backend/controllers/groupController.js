// Import necessary libraries
const Group = require('../models/group');
const User = require('../models/user');

// Create a new Group
async function createGroup(req, res) {
    console.log('Creating a new Group');
    try {
        console.log('Creating Group object');
        const group = new Group({
            name: req.body.name,
            description: req.body.description,
            created_by: req.body.userId,
            members: [req.body.userId], // Add the creator as the first member
        });

        console.log('Saving Group to database');
        const savedGroup = await group.save();
        console.log('Group created successfully');
        res.status(201).json(savedGroup);
    } catch (err) {
        console.log('Error creating Group:', err.message);
        res.status(400).json({ error: err.message });
    }
}

// Get all Groups
async function getAllGroups(req, res) {
    console.log('Fetching all Groups');
    try {
        const groups = await Group.find();
        console.log('All Groups retrieved successfully');
        res.json(groups);
    } catch (err) {
        console.log('Error fetching Groups:', err.message);
        res.status(500).json({ error: err.message });
    }
}

// Get a specific Group by ID
async function getGroupById(req, res) {
    console.log('Fetching Group by ID');
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            console.log('Group not found');
            return res.status(404).json({ message: 'Group not found' });
        }
        console.log('Group retrieved successfully');
        res.json(group);
    } catch (err) {
        console.log('Error fetching Group:', err.message);
        res.status(500).json({ error: err.message });
    }
}

// Update a Group by ID
async function updateGroup(req, res) {
    console.log('Updating Group by ID');
    try {
        console.log('Finding and updating Group');
        const updatedGroup = await Group.findByIdAndUpdate(
            req.params.groupId,
            req.body,
            { new: true }
        );
        if (!updatedGroup) {
            console.log('Group not found for update');
            return res.status(404).json({ message: 'Group not found' });
        }
        console.log('Group updated successfully');
        res.json(updatedGroup);
    } catch (err) {
        console.log('Error updating Group:', err.message);
        res.status(400).json({ error: err.message });
    }
}

// Delete a Group by ID
async function deleteGroup(req, res) {
    console.log('Deleting Group by ID');
    try {
        console.log('Finding and deleting Group');
        const deletedGroup = await Group.findByIdAndDelete(req.params.groupId);
        if (!deletedGroup) {
            console.log('Group not found for deletion');
            return res.status(404).json({ message: 'Group not found' });
        }
        console.log('Group deleted successfully');
        res.json({ message: 'Group deleted successfully' });
    } catch (err) {
        console.log('Error deleting Group:', err.message);
        res.status(500).json({ error: err.message });
    }
}

// Join a Group
async function joinGroup(req, res) {
    console.log('Joining Group');
    try {
        console.log('Finding Group by ID');
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            console.log('Group not found');
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the user is already a member
        console.log('Checking if user is already a member');
        if (!group.members.includes(req.body.userId)) {
            console.log('Adding user to Group members');
            group.members.push(req.body.userId);
            await group.save();
            console.log('User added to Group successfully');
        } else {
            console.log('User is already a member of the Group');
        }
        res.json(group);
    } catch (err) {
        console.log('Error joining Group:', err.message);
        res.status(500).json({ error: err.message });
    }
}

// Export all group controller functions
module.exports = {
    createGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    joinGroup,
};
