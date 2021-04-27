
const Joi = require ('joi');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const express=require ('express');

const app =express();
app.use(express.static("public"));

app.use(express.json());
app.use(bodyParser.json()); //TP MAKE IT UNDERSTAND JASON SENT FROM FRONT END
app.get('/',(req,res)=>{
res.sendFile(__dirname+'/lms-app.html')

})

const courses = [
    { name: 'AI', code: 'CSE124', id: 1 ,description:"SecondTermCourse"},
    { name: 'Multimedia', code: 'CSE457', id:2,description:"Electivecourse"},
    { name: 'Compilers', code: 'CSE789', id: 3,dexcription:"FirstTermCourse" }
];

// to get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// to get single course
// api/courses/abc123 to get course of code abc123
app.get('/api/courses/:code', (req, res) => {
    const course = courses.find(c => c.code === req.params.code);
    if (!course) // error 404 object not found
    {
        res.status(404).send('The course with the given code was not found.');
        return;
    }
    res.send(course);
});


// Add course
app.post('/api/courses', (req, res) => {
    // validate request
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().pattern(new RegExp('[A-Za-z]{3}[0-9]{3}')).required(),
        description: Joi.string().max(200)
    })

    const result = schema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        name: req.body.name, // assuming that request body there's a name property
        code: req.body.code,
        id: courses.length+1,
        description: req.body.description
    };
    courses.push(course);
    res.send(course);
});


// Add course with HTML
app.post('/web/courses/create/addcourse',urlencodedParser, (req, res) => {
    // validate request
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().pattern(new RegExp('[A-Za-z]{3}[0-9]{3}')).required(),
        description: Joi.string().max(200).optional().allow('')
    })

    const result = schema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        name: req.body.name, // assuming that request body there's a name property
        code: req.body.code,
        id: courses.length+1,
        description: req.body.description,
    };
    courses.push(course);
    res.send(course);
});

// Updating resources
app.put('/api/courses/:code', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.code === req.params.code);
    if (!course) // error 404 object not found
    {
        res.status(404).send('The course with the given code was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});


// Deleting a course
app.delete('/api/courses/:code', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.code === req.params.code);
    if (!course) // error 404 object not found
    {
        res.status(404).send('The course with the given code was not found.');
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().pattern(new RegExp('[A-Za-z]{3}[0-9]{3}')).required(),
        description: Joi.string().max(200)
    })
    return schema.validate(course);
}


const students = [
    { name: 'Nouran', code: '1601602', id: 1 },
    { name: 'Khaled', code: '1601603', id: 2 },
    { name: 'Ismail', code: '1601605', id: 3 }
];

// to get all students
app.get('/api/students', (req, res) => {
    res.send(students);
});

// to get single student
// api/students/1601602 to get student of code 1601602
app.get('/api/students/:code', (req, res) => {
    const student = students.find(s => s.code === req.params.code);
    if (!student) // error 404 object not found
    {
        res.status(404).send('The student with the given code was not found.');
        return;
    }
    res.send(student);
});

// Add student
app.post('/api/students', (req, res) => {
    // validate request
    const schema = Joi.object({
        name: Joi.string().pattern(new RegExp('[\'-A-Za-z-"-"]{3}')).required(),
        code: Joi.string().pattern(new RegExp('[0-9]{7}')).max(7).required()
    })

    const result = schema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const student = {
        name: req.body.name, // assuming that request body there's a name property
        code: req.body.code,
        id: students.length+1
    };
    students.push(student);
    res.send(student);
});


//Add student with HTML
app.post('/web/students/create/addstudent',urlencodedParser, (req, res) => {
    // validate request
    const schema = Joi.object({
        name: Joi.string().pattern(new RegExp('[\'-A-Za-z-"-"]{3}')).required(),
        code: Joi.string().pattern(new RegExp('[0-9]{7}')).max(7).required()
    })

    const result = schema.validate(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const student = {
        name: req.body.name, // assuming that request body there's a name property
        code: req.body.code,
        id: students.length+1,
    };
    students.push(student);
    res.send(student);
});

// Updating resources
app.put('/api/students/:code', (req, res) => {
    // Look up the student 
    // If not existing, return 404
    const student = students.find(s => s.code=== req.params.code);
    if (!student) // error 404 object not found
    {
        res.status(404).send('The student with the given code was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateStudent(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the student 
    // Return the updated student
    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);
});


// Deleting a student
app.delete('/api/students/:code', (req, res) => {
    // Look up the student 
    // If not existing, return 404
    const student = students.find(s => s.code === req.params.code);
    if (!student) // error 404 object not found
    {
        res.status(404).send('The student with the given code was not found.');
        return;
    }

    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);

    // Return the same student
    res.send(student);
});


function validateStudent(student) {
    const schema = Joi.object({
        name: Joi.string().pattern(new RegExp('[\'-A-Za-z-"-"]{3}')).required(),
        code: Joi.string().pattern(new RegExp('[0-9]{7}')).max(7).required()
    })
    return schema.validate(student);
}


// Environment variable
const host='0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port,host, () => console.log(`Listeneing on port ${port}......`)
 /* optionally a function that called when the app starts listening to the given port */);
