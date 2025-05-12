const Category = require('../models/category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure `uploads/categories/` folder exists
const uploadDir = 'uploads/categories/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save images in `uploads/categories/`
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Multer middleware for image uploads
const upload = multer({ storage });

module.exports = upload;


// Add a new category with an image
async function addCategory(req, res) {
    try {
        const { title, description } = req.body;
        const image = req.file ? `/uploads/categories/${req.file.filename}` : null;

        if (!title || !description || !image) {
            return res.status(400).json({ message: 'Title, description, and image are required' });
        }

        const newCategory = new Category({ title, description, image });
        await newCategory.save();

        //res.status(201).json(newCategory);
        res.status(201).json({ status: (201), message: 'Category added successfully', newCategory });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving category');
    }
}


// Get all categories
async function getCategories(req, res) {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching categories');
    }
}

// Get a single category by ID
async function getCategory(req, res) {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        //res.status(200).json(category);
                //res.status(201).json(newCategory);
                res.status(201).json({ status: (201), category });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching category');
    }
}

async function updateCategory(req, res) {
    try {
        const { title, description } = req.body;
        let updateData = { title, description };

        if (req.file) {
            updateData.image = `/uploads/categories/${req.file.filename}`;
        }

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        //res.status(200).json(updatedCategory);
        res.status(201).json({ status: (201), message: 'Category updated successfully', updatedCategory });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating category');
    }
}


    // Delete category by ID
    async function deleteCategory(req, res) {
        try {
            const deletedCategory = await Category.findByIdAndDelete(req.params.id);

            if (!deletedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting category');
        }
    }


// Export all functions
module.exports = {
    addCategory,
    updateCategory,
    getCategories,
    getCategory,
    deleteCategory,
    upload
};
