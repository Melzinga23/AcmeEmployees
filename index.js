const express = require("express");
const { Pool } = require("pg");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(__dirname + '/public'));
const db = new Pool({
  user:"postgres", 
  host:"localhost",
  database:"acme_hr_db",
  port: 5433, password: "Mlynch24"
})
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
 
  app.get('/api/employees', async(req, res, next)=>{
    try {
      const result = await db.query('SELECT * FROM Employees'); 
res.json(result.rows);
console.log(result.rows)

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' + err });
    }
  })
