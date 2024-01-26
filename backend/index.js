
const express = require('express');
const cors = require('cors');
const port = 3001;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const salt = 10
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET", "DELETE", "PUT", ""],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      return res.json({ Error: 'No email exists in this system' });
    }

    const passwordMatch = await bcrypt.compare(password.toString(), user.password);

    if (passwordMatch) {
      const token = jwt.sign({ name: user.name }, 'jwt-secret-key', { expiresIn: '1d' });
      res.cookie('token', token);
      return res.json({ Status: 'Success', Name: user.name });
    } else {
      return res.json({ Error: "Password doesn't match" });
    }
  } catch (error) {
    console.error('Login error in server', error);
    return res.json({ Error: 'Login error in server' });
  }
});

const verifyUser = (req, res, next) => {

  const token = req.cookies.token
  if (!token) {
    return res.json({ Message: "The user is not authenticated" })
  }
  else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Message: "The token is not okay" })
      }
      else {
        req.name = decoded.name
        next()
      }
    })
  }

}

app.get('/addCookie', verifyUser, (req, res) => {
  return res.json({ Status: "Success", Name: req.name })
})

app.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ Status: "Success" })
})

app.post('/addEmployee', async (req, res) => {
  try {
    const first_name= req.body.first_name
    const last_name = req.body.last_name
    const date_of_birth = new Date(req.body.date_of_birth)
    const present_address = req.body.present_address 
    const parmanent_address = req.body.permanent_address
    const mobile_no = req.body.mobile_no
    const designation = req.body.designation
    const category = req.body.category
    const salary = req.body.salary
    const active_status = req.body.active_status 
    const employee_image = req.body.employee_image
    const start_work = new Date();
   

    await prisma.employee.create({
      data: {
        first_name,
        last_name,
        date_of_birth,
        present_address,
        parmanent_address,
        mobile_no,
        start_work,
        designation,
        category,
        salary,
        active_status,
        employee_image,
      },
    });

    return res.json({ Status: 'Success' });
  } catch (err) {
    console.error(err);
    return res.json({ Error: 'Inserting Data error in server' });
  }
});

app.get("/collectEmployee", async (req, res) => {
  try {
    const result = await prisma.employee.findMany();
    if (result.length === 0) {
      return res.json({ Error: 'No data exist' });
      
    } else {
      return res.json({ Status: 'Success', result: result });
    }
  } catch (error) {
    console.error('Error getting data from server:', error);
    return res.status(500).json({ Error: 'Getting data error in server' });
  }
});

app.get("/collectProduct", async (req, res) => {
  try {
    const result = await prisma.product.findMany();
    if (result.length === 0) {
      return res.json({ Error: 'No data exist' });
      
    } else {
      return res.json({ Status: 'Success', result: result });
    }
  } catch (error) {
    console.error('Error getting data from server:', error);
    return res.status(500).json({ Error: 'Getting data error in server' });
  }
});

app.post('/addProduct', async(req, res) => {
  try{
    const product_name = req.body.product_name
    const product_type = req.body.product_type
    const product_category = req.body.product_category
    const unit = parseInt(req.body.unit)
    const brand = req.body.brand
    const quantity = parseInt(req.body.quantity)

    await prisma.product.create({
      data: {
        product_name,
        product_type,
        product_category,
        unit,
        brand,
        quantity,
      },
    })
    return res.json({ Status: 'Success' });
    
  }catch(error){
    return res.status(500).json({Error: 'Inserting data error in server'})
  }
})

app.delete('/deleteEmployee/:id', async(req, res) => {
  try{
    const id = parseInt(req.params.id)
    // console.log(id)
    const deletedEmployee = await prisma.employee.delete({
      where: {
        employee_id: id,
      },
    });
    return res.status(200).json({Status: 'Success', result: deletedEmployee})
  }catch(error){
    return res.status(500).json({Error: 'Error occurred during deleting data'})
  }
  
})

app.put('/updateEmployee/:id', async(req, res) => {
  try{
    const id = parseInt(req.params.id)
    // console.log(id)
    const first_name= req.body.first_name
    const last_name = req.body.last_name
    const date_of_birth = new Date(req.body.date_of_birth)
    const present_address = req.body.present_address 
    const parmanent_address = req.body.parmanent_address
    const mobile_no = req.body.mobile_no
    const designation = req.body.designation
    const category = req.body.category
    const salary = req.body.salary
    const active_status = req.body.active_status 
    const employee_image = req.body.employee_image
    const updatedEmployee = await prisma.employee.update({
      where: {
        employee_id: id,
      },
      data: {
        first_name : first_name, 
        last_name: last_name, 
        date_of_birth: date_of_birth, 
        present_address: present_address, 
        parmanent_address: parmanent_address, 
        mobile_no: mobile_no,
        designation: designation, 
        category: category, 
        salary: salary, 
        active_status: active_status, 
        employee_image: employee_image,
      },
    });
    return res.status(200).json({Status: 'Success', result: updatedEmployee})
  }catch(error){
    return res.status(500).json({Error: 'Error occurred during updating  data'})
  }
})

app.put('/updateProduct/:id', async(req, res) => {
  try{
    const id = parseInt(req.params.id)
    // console.log(id)
    const name = req.body.product_name
    const type = req.body.product_type
    const category = req.body.product_category
    const unit = parseInt(req.body.unit)
    const brand = req.body.brand
    const quantity = parseInt(req.body.quantity)
   
    const updatedProduct = await prisma.product.update({
      where: {
        product_id: id,
      },
      data: {
        product_name: name,
        product_type: type,
        product_category: category,
        unit: unit,
        brand: brand,
        quantity: quantity,
      },
    });
    return res.status(200).json({Status: 'Success', result: updatedProduct})
  }catch(error){
    return res.status(500).json({Error: 'Error occurred during updating  data'})
  }
})

app.delete('/deleteProduct/:id', async(req, res) => {
  try{
    const id = parseInt(req.params.id)
    // console.log(id)
    const deletedProduct = await prisma.product.delete({
      where : {
        product_id: id
      }
    });
    return res.status(200).json({Status: 'Success', result: deletedProduct})
  }catch(error){
    return res.status(500).json({Error: 'Error occurred during deleting data'})
  }
})

app.get('/getProduct', async(req, res) => {
  try {
    const result = await prisma.product.findMany({
      where: {
        product_category: 'Gas'
      }

    });
    if (result.length === 0) {
      return res.json({ Error: 'No data exist' });
      
    } else {
      return res.json({ Status: 'Success', result: result });
    }
  } catch (error) {
    console.error('Error getting data from server:', error);
    return res.status(500).json({ Error: 'Getting data error in server' });
  }
})

app.post('/addPurchase', async(req, res) => {
  try{
    const supplier = req.body.supplier
    const purchase_date = new Date(req.body.purchase_date)
    const purchase_status = req.body.purchase_status
    const business_location = req.body.business_location
    const selected_products = req.body.selected_products
    const net_amount = parseInt(req.body.net_amount)
    // console.log(net_amount)
    // console.log(selected_products)
    const temp1 = selected_products.find((item) => item.product_name === 'Omera 5.5Kg Gas');
    const gas_5_5 = temp1 ? parseInt(temp1.quantity) : 0
    const temp2 = selected_products.find((item) => item.product_name === 'Omera 12Kg Gas');
    const gas_12 = temp2 ? parseInt(temp2.quantity) : 0
    const temp3 = selected_products.find((item) => item.product_name === 'Omera 25Kg Gas');
    const gas_25 = temp3 ? parseInt(temp3.quantity) : 0
    const temp4 = selected_products.find((item) => item.product_name === 'Omera 35Kg Gas');
    const gas_35 = temp4 ? parseInt(temp4.quantity) : 0
    const temp5 = selected_products.find((item) => item.product_name === 'Omera 45Kg Gas');
    const gas_45 = temp5 ? parseInt(temp5.quantity) : 0

    const result = await prisma.purchases.create({
      data : {
        date : purchase_date,
        location : business_location,
        supplier : supplier,
        status : purchase_status,
        gas_5_5 : gas_5_5,
        gas_12 : gas_12,
        gas_25 : gas_25,
        gas_35 : gas_35,
        gas_45 : gas_45,
        total : net_amount
      }
    })
    return res.status(200).json({Status: 'Success', result : result})
  }catch(error){
    console.error('Error inserting data in server:', error);
    return res.status(500).json({ Error: 'Inserting data error in server' });
  }
})

app.get('/listPurchases', async(req, res) => {
  try{
    const result = await prisma.purchases.findMany();
    if(result.length === 0)
    {
      return res.status(200).json({Error: 'No Such data exist in the server'})
    }else{
      return res.status(200).json({Status: 'Success', result: result})
    }

  }catch(error){
    console.error('Error getting data from server:', error);
    return res.status(500).json({ Error: 'Getting data error from server' });
  }
})

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.json({ Status: 'Success' });
  } catch (err) {
    console.error(err);
    return res.json({ Error: 'Inserting Data error in server' });
  }
});

app.delete('/deletePurchase/:id', async(req, res)=> {
  try{
    const id = parseInt(req.params.id)
    const deletedPurchase = await prisma.purchases.delete({
      where: {
        purchase_id: id
      }
    })
    return res.status(200).json({Status: 'Success', result: deletedPurchase})
  }
  catch(err){
    return res.status(500).json({Error: 'Error occurred during deleting data'})
  }
})

app.put('/updatePurchase/:id', async (req, res) => {
  try{
    const id = parseInt(req.params.id)
    //console.log(req.body)
    const status = req.body.status
    const gas_5_5 = parseInt(req.body.gas_5_5)
    const gas_12 = parseInt(req.body.gas_12)
    const gas_25 = parseInt(req.body.gas_25)
    const gas_35 = parseInt(req.body.gas_35)
    const gas_45 = parseInt(req.body.gas_45)
    const total = req.body.total
    // console.log(total)

    const updatedPurchase = await prisma.purchases.update({
      where: {
        purchase_id: id
      },

      data: {
        status,
        gas_5_5,
        gas_12,
        gas_25,
        gas_35,
        gas_45,
        total,
      }
    })
    return res.status(200).json({Status: 'Success', result: updatedPurchase})
  }
  catch(err)
  {
    return res.status(500).json({Error: 'Unable to update the data'})
  }
})


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
