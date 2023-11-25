const { ObjectId } = require('mongoose').Types;
const multer = require('multer');
const path = require('path');
const myRouter = require('express').Router();
const blog = require('../schema/blog');

// IMAGE HANDLING
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
        const imagePath = 'http://127.0.0.1:5500/server/uploads/' + filename;
    },
});


const upload = multer({ storage: storage });

myRouter.post('/post-blog', upload.single('poster'), async (req, res) => {
    try {
        const { email, title, description } = req.body;
        // const poster = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
        const poster = req.file ? `http://127.0.0.1:5500/server/uploads/${req.file.filename}` : null;

        const newBlog = new blog({
            email,
            title,
            description,
            poster,
        });

        await newBlog.save();

        res.status(201).json({ message: 'Blog submitted successfully', blog: newBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
myRouter.get('/display-blog', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email)
            return res.status(400).send('email not received')
        const rows = await blog.find({ email });
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No entries found' });
        }
        return res.send(rows);
    } catch (error) {
        return res.status(500).send(error);
    }
});
myRouter.get('/display-all', async (req, res) => {
    try {
        const rows = await blog.find();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No entries found' });
        }
        return res.send(rows);
    } catch (error) {
        return res.status(500).send(error);
    }
});

myRouter.delete('/delete-blog/:id', async (req, res) => {
    const entryId = req.params.id;

    if (!ObjectId.isValid(entryId)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    try {
        const deletedEntry = await blog.findByIdAndDelete(entryId);

        if (!deletedEntry) {
            return res.status(404).json({ error: 'Blog entry not found' });
        }

        console.log(`Blog entry deleted: ${deletedEntry}`);
        res.json({ message: 'Blog entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
myRouter.get('/get-blog/', async (req, res) => {
    try {
        const { entryId } = req.query;

        if (!entryId) {
            return res.status(400).send('Entry not received not received');
        }

        if (!ObjectId.isValid(entryId)) {
            return res.status(400).send('Invalid ObjectId');
        }

        const entry = await blog.findOne({ _id: entryId });

        if (!entry) {
            return res.status(404).json({ error: 'Blog entry not found' });
        }

        return res.send(entry);
    } catch (error) {
        return res.status(500).send(error);
    }
});

myRouter.put('/update-blog/:id', upload.single('poster'), async (req, res) => {
    const _id = req.params.id;
    console.log('id', _id)
    try {
        if (!ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid entryId' });
        }

        const updatedData = {
            email: req.body.email,
            title: req.body.title,
            description: req.body.description,
        };

        // if (req.file) {
        //     updatedData.image = `http://127.0.0.1:5500/server/uploads/${req.file.filename}`;
        // }

        const updatedEntry = await blog.findByIdAndUpdate(_id, updatedData, { new: true });
        if (req.file) {
            const poster = req.file ? `http://127.0.0.1:5500/server/uploads/${req.file.filename}` : updatedEntry.poster;
        }
        if (!updatedEntry) {
            return res.status(404).json({ error: 'Blog entry not found' });
        }

        res.json(updatedEntry);
    } catch (error) {
        console.error('Error updating blog entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = myRouter;
