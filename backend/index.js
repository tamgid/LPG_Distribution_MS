
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
    const brand = req.body.brand
    const selling_price = req.body.selling_price
 
    await prisma.product.create({
      data: {
        product_name,
        product_type,
        product_category,
        brand,
        unit,
        selling_price 
      },
    })
    return res.json({ Status: 'Success' });
    
  }catch(error){
    return res.status(500).json({Error: 'Inserting data error in server'})
  }
})

// sales route in server1 using Prisma
app.get('/sales', async (req, res) => {
  try {
    const { from, to, customer } = req.query;

    // Construct dynamic filters for the query
    const filters = {};
    
    if (from && to) {
      filters.date = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    if (customer) {
      filters.customer_name = {
        contains: customer,
      };
    }

    // Fetch sales data using Prisma
    const salesData = await prisma.sales.findMany({
      where: filters,
    });

    return res.json(salesData);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching sales data', details: error });
  }
});

// sales_summary route in server1 using Prisma
app.get('/sales_summary', async (req, res) => {
  try {
    const { customer } = req.query;

    // Construct dynamic filter
    const filters = {};
    if (customer) {
      filters.customer_name = {
        contains: customer,
        mode: 'insensitive', // Optional: make the search case-insensitive
      };
    }

    // Fetch sales summary using Prisma with aggregation
    const salesSummary = await prisma.sales.groupBy({
      by: ['customer_name'],
      where: filters,
      _sum: {
        total: true,
        gas_5_5: true,
        cyl_5_5: true,
        gas_12: true,
        cyl_12: true,
        gas_25: true,
        cyl_25: true,
        gas_35: true,
        cyl_35: true,
        gas_45: true,
        cyl_45: true,
      },
    });

    // Map the result to ensure a consistent response format
    const result = salesSummary.map(item => ({
      customer_name: item.customer_name,
      total: item._sum.total || 0,
      gas_5_5: item._sum.gas_5_5 || 0,
      cyl_5_5: item._sum.cyl_5_5 || 0,
      gas_12: item._sum.gas_12 || 0,
      cyl_12: item._sum.cyl_12 || 0,
      gas_25: item._sum.gas_25 || 0,
      cyl_25: item._sum.cyl_25 || 0,
      gas_35: item._sum.gas_35 || 0,
      cyl_35: item._sum.cyl_35 || 0,
      gas_45: item._sum.gas_45 || 0,
      cyl_45: item._sum.cyl_45 || 0,
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching sales summary:', error); // Log error for debugging
    return res.status(500).json({ error: 'Error fetching sales summary', details: error });
  }
});



// purchases route in server1 using Prisma
app.get('/purchases', async (req, res) => {
  try {
    const { from, to, supplier } = req.query;

    // Construct dynamic filters
    const filters = {};
    
    if (from && to) {
      filters.date = {
        gte: new Date(from),
        lte: new Date(to),
      };
    }

    if (supplier) {
      filters.supplier = {
        contains: supplier,
      };
    }

    // Fetch purchase data using Prisma
    const purchaseData = await prisma.purchases.findMany({
      where: filters,
    });

    return res.json(purchaseData);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching purchase data', details: error });
  }
});


app.get('/purchases_summary', async (req, res) => {
  try {
    const { supplier } = req.query;

    // Construct dynamic filter for Prisma
    const filters = {};
    if (supplier) {
      filters.supplier = {
        contains: supplier, // Partial match for supplier
        mode: 'insensitive', // Optional: make the search case-insensitive
      };
    }

    // Fetch purchase summary using Prisma with aggregation
    const purchasesSummary = await prisma.purchases.groupBy({
      by: ['supplier'],
      where: filters,
      _sum: {
        total: true,
        gas_5_5: true,
        cyl_5_5: true,
        gas_12: true,
        cyl_12: true,
        gas_25: true,
        cyl_25: true,
        gas_35: true,
        cyl_35: true,
        gas_45: true,
        cyl_45: true,
      },
    });

    // Map the result to have a consistent structure
    const result = purchasesSummary.map(item => ({
      supplier: item.supplier,
      total: item._sum.total || 0,
      gas_5_5: item._sum.gas_5_5 || 0,
      cyl_5_5: item._sum.cyl_5_5 || 0,
      gas_12: item._sum.gas_12 || 0,
      cyl_12: item._sum.cyl_12 || 0,
      gas_25: item._sum.gas_25 || 0,
      cyl_25: item._sum.cyl_25 || 0,
      gas_35: item._sum.gas_35 || 0,
      cyl_35: item._sum.cyl_35 || 0,
      gas_45: item._sum.gas_45 || 0,
      cyl_45: item._sum.cyl_45 || 0,
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching purchases summary:', error); // Log error for debugging
    return res.status(500).json({ error: 'Error fetching purchases summary', details: error });
  }
});




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
    const selling_price = parseInt(req.body.selling_price)
   
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
        selling_price: selling_price,
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

app.get('/sales', (req, res) => {
    let startDate = req.query.from;
    let endDate = req.query.to;
    let customerName = req.query.customer;
    
    let sql = "SELECT * FROM sales WHERE 1=1"; // Adding WHERE 1=1 for dynamic query construction
    
    if (startDate && endDate) {
        sql += ` AND date BETWEEN '${startDate}' AND '${endDate}'`;
    }
    
    if (customerName) {
        sql += ` AND customer_name LIKE '%${customerName}%'`; // Assuming partial match on customer name
    }

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/purchases', (req, res) => {
    let startDate = req.query.from;
    let endDate = req.query.to;
    let supplierName = req.query.supplier;
    
    let sql = "SELECT * FROM purchases WHERE 1=1"; // Adding WHERE 1=1 for dynamic query construction
    
    if (startDate && endDate) {
        sql += ` AND date BETWEEN '${startDate}' AND '${endDate}'`;
    }
    
    if (supplierName) {
        sql += ` AND supplier LIKE '%${supplierName}%'`; // Assuming partial match on supplier name
    }

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/sales_summary', (req, res) => {
    let customerName = req.query.customer;
    
    let sql = "SELECT customer_name, SUM(total) as total, SUM(gas_5_5) as gas_5_5,SUM(cyl_5_5) as cyl_5_5,SUM(gas_12) as gas_12,SUM(cyl_12) as cyl_12,SUM(cyl_12) as cyl_12,SUM(gas_25) as gas_25,SUM(cyl_25) as cyl_25,SUM(gas_35) as gas_35,SUM(cyl_35) as cyl_35,SUM(gas_45) as gas_45,SUM(cyl_45) as cyl_45 FROM sales WHERE 1=1"; // Adding WHERE 1=1 for dynamic query construction
    
    if (customerName) {
        sql += ` AND customer_name LIKE '%${customerName}%'`; // Assuming partial match on customer name
    }

    sql += ` GROUP BY customer_name`;

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/purchases_summary', (req, res) => {
    let supplierName = req.query.supplier;
    
    let sql = "SELECT supplier, SUM(total) as total, SUM(gas_5_5) as gas_5_5,SUM(cyl_5_5) as cyl_5_5,SUM(gas_12) as gas_12,SUM(cyl_12) as cyl_12,SUM(cyl_12) as cyl_12,SUM(gas_25) as gas_25,SUM(cyl_25) as cyl_25,SUM(gas_35) as gas_35,SUM(cyl_35) as cyl_35,SUM(gas_45) as gas_45,SUM(cyl_45) as cyl_45 FROM purchases WHERE 1=1"; // Adding WHERE 1=1 for dynamic query construction
    
    if (supplierName) {
        sql += ` AND supplier LIKE '%${supplierName}%'`; // Assuming partial match on customer name
    }

    sql += ` GROUP BY supplier`;

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

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
    const temp1 = selected_products.find((item) => item.product_name === 'Omera 5.5 Kg Gas');
    const gas_5_5 = temp1 ? parseInt(temp1.quantity) : 0
    const temp2 = selected_products.find((item) => item.product_name === 'Omera 12 Kg Gas');
    const gas_12 = temp2 ? parseInt(temp2.quantity) : 0
    const temp3 = selected_products.find((item) => item.product_name === 'Omera 25 Kg Gas');
    const gas_25 = temp3 ? parseInt(temp3.quantity) : 0
    const temp4 = selected_products.find((item) => item.product_name === 'Omera 35 Kg Gas');
    const gas_35 = temp4 ? parseInt(temp4.quantity) : 0
    const temp5 = selected_products.find((item) => item.product_name === 'Omera 45 Kg Gas');
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

app.post('/addSale', async(req, res) => {
  try{
    const customer_name = req.body.customerName
    const sale_date = new Date(req.body.sale_date)
    const delivery_date = new Date(req.body.delivery_date)
    const location = req.body.location
    const selected_products = req.body.selected_products
    const net_amount = parseInt(req.body.net_amount)
    // console.log(net_amount)
    // console.log(selected_products)
    const temp1 = selected_products.find((item) => item.product_name === 'Omera 5.5 Kg Gas');
    const gas_5_5 = temp1 ? parseInt(temp1.quantity) : 0
    const temp2 = selected_products.find((item) => item.product_name === 'Omera 12 Kg Gas');
    const gas_12 = temp2 ? parseInt(temp2.quantity) : 0
    const temp3 = selected_products.find((item) => item.product_name === 'Omera 25 Kg Gas');
    const gas_25 = temp3 ? parseInt(temp3.quantity) : 0
    const temp4 = selected_products.find((item) => item.product_name === 'Omera 35 Kg Gas');
    const gas_35 = temp4 ? parseInt(temp4.quantity) : 0
    const temp5 = selected_products.find((item) => item.product_name === 'Omera 45 Kg Gas');
    const gas_45 = temp5 ? parseInt(temp5.quantity) : 0

    const result = await prisma.sales.create({
      data : {
        customer_name: customer_name,
        date : sale_date,
        location : location,
        delivery_date: delivery_date,
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

app.get('/listSales', async(req, res) => {
  try{
    const result = await prisma.sales.findMany();
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

app.put('/updateSale/:id', async (req, res) => {
  try{
    const id = parseInt(req.params.id)
    //console.log(req.body)
    const customer_name = req.body.customer_name
    const gas_5_5 = parseInt(req.body.gas_5_5)
    const gas_12 = parseInt(req.body.gas_12)
    const gas_25 = parseInt(req.body.gas_25)
    const gas_35 = parseInt(req.body.gas_35)
    const gas_45 = parseInt(req.body.gas_45)
    const total = req.body.total
    // console.log(total)

    const updatedSale = await prisma.sales.update({
      where: {
        sales_id: id
      },

      data: {
        customer_name,
        gas_5_5,
        gas_12,
        gas_25,
        gas_35,
        gas_45,
        total,
      }
    })
    return res.status(200).json({Status: 'Success', result: updatedSale})
  }
  catch(err)
  {
    return res.status(500).json({Error: 'Unable to update the data'})
  }
})

app.delete('/deleteSale/:id', async(req, res)=> {
  try{
    const id = parseInt(req.params.id)
    const deletedSale = await prisma.sales.delete({
      where: {
        sales_id: id
      }
    })
    return res.status(200).json({Status: 'Success', result: deletedSale})
  }
  catch(err){
    return res.status(500).json({Error: 'Error occurred during deleting data'})
  }
})

app.post('/addAccount', async (req, res) => {
  try {
   
    const account_name = req.body.account_name;
    const account_type = req.body.account_type;
    const account_number = req.body.account_number;
    const short_description = req.body.short_description;
    const initial_balance = parseInt(req.body.initial_balance);
    
    const result = await prisma.accounts.create({
      data: {
        account_name,
        account_type,
        account_number,
        short_description,
        initial_balance,
      },
    });

    return res.json({ Status: 'Success',  Result: result});
  } catch (err) {
    console.error(err);
    return res.json({ Error: 'Inserting Data error in server' });
  }
});

app.get('/collectAccount', async(req, res) => {
  try{
    const result = await prisma.accounts.findMany();
    //console.log(result)
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

app.get('/collectTotalPurchase', async (req, res) => {
  try {
    const result = await prisma.purchases.aggregate({
      _sum: {
        
        total: true,
      },
    });
    return res.status(200).json({ Status: 'Success', Result: result._sum.total });
  } catch (error) {
    console.error('Error getting data from server:', error);
    return res.status(500).json({ Error: 'Getting data error from server' });
  }
});

app.get('/collectTotalSale', async (req, res) => {
  try {
    const result = await prisma.sales.aggregate({
      _sum: {
        
        total: true,
      },
    });
    return res.status(200).json({ Status: 'Success', Result: result._sum.total });
  } catch (error) {
    console.error('Error getting data from server:', error);
    return res.status(500).json({ Error: 'Getting data error from server' });
  }
});

app.post('/addContacts', async (req, res) => {
  try {
    const name= req.body.name
    const company_name = req.body.company_name
    const email=req.body.email
    const mobile = req.body.mobile
    const full_address = req.body.full_address 
    const district = req.body.district
    const contactType = req.body.contactType
   

    await prisma.contacts.create({
      data: {
        name,
        company_name,
        email,
        mobile,
        full_address,
        district,
        contactType,
      },
    });

    return res.json({ Status: 'Success' });
  } catch (err) {
    console.error(err);
    return res.json({ Error: 'Inserting Data error in server' });
  }
});


app.get("/supplierContacts", async (req, res) => {
  try {
    const suppliers = await prisma.contacts.findMany({
      where: { contactType: "supplier" },
      select: {
        contact_id: true,
        name: true,
        company_name: true,
        email: true,
        mobile: true,
        full_address: true,
        district: true,
      },
    });
    res.json({ Status: "Success", result: suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ Error: "Error fetching suppliers" });
  }
});

app.get("/customerContacts", async (req, res) => {
  try {
    const customers = await prisma.contacts.findMany({
      where: { contactType: "customer" },
      select: {
        contact_id: true,
        name: true,
        company_name: true,
        email: true,
        mobile: true,
        full_address: true,
        district: true,
      },
    });
    res.json({ Status: "Success", result: customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ Error: "Error fetching customers" });
  }
});


app.delete('/deleteContacts/:id', async(req, res) => {
  try{
    const id = parseInt(req.params.id)
    // console.log(id)
    const deletedContacts = await prisma.contacts.delete({
      where: {
        contact_id: id,
      },
    });
    return res.status(200).json({Status: 'Success', result: deletedContacts})
  }catch(error){
    return res.status(500).json({Error: 'Error occurred during deleting data'})
  }
  
})

app.put('/updateContacts/:id', async(req, res) => {
  try{
    const id = parseInt(req.params.id)
    // console.log(id)
    const name= req.body.name
    const company_name = req.body.company_name
    const email = req.body.email
    const mobile = req.body.mobile
    const full_address = req.body.full_address 
    const district = req.body.district
    const contactType = req.body.contactType 
    const updatedContacts = await prisma.contacts.update({
      where: {
        contact_id: id,
      },
      data: {
        name : name, 
        company_name : company_name, 
        email : email,
        mobile: mobile,
        full_address: full_address, 
        district: district, 
        contactType: contactType,
      },
    });
    return res.status(200).json({Status: 'Success', result: updatedContacts})
  }catch(error){
    return res.status(500).json({Error: 'Error occurred during updating  data'})
  }
})




app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
