import React, { useState } from "react";
import "./AddProducts.css"; // Import your custom CSS for styling
import Alert from "./Alert";
import axios from "axios";
import {NavLink} from "react-router-dom"
import useConditionalNavigate from './navigationUtils'; 

function AddProducts(props) {
  useConditionalNavigate(props.userName === "", "/");
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    product_category: "",
    unit: "",
    brand: "",
    quantity: "",
  });

  const [alert, setAlert] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:3001/addProduct", formData)
      .then((res) => {
        if (res.data.Status === "Success") {
          setFormData({
            ...formData,
            product_name: "",
            product_type: "",
            product_category: "",
            unit: "",
            brand: "",
            quantity: "",
          });
          console.log("Successfully Inserted Data");
          setAlert(true);
          setTimeout(() => {
            setAlert(false);
          }, 5000);
        } else {
          console.log(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="addButton3">
        <NavLink className="nav-link" to="/home/products">
          <button className="btn btn-success" type="submit" onClick={() => {}}>
          <i className="fa fa-list-ul" aria-hidden="true">
              {" "}
              List of Products
            </i>
          </button>
        </NavLink>
      </div>
      <div className="form-container">
        <h3>ENTER THE FOLLOWING INFORMATION TO ADD A NEW PRODUCT</h3>
        <form>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Product Name:
                </label>
                <select
                  class="form-select form-select-lg mb-3"
                  aria-label=".form-select-lg example"
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Please select
                  </option>
                  <option value="Omera 5.5 Kg Gas">Omera 5.5 Kg Gas</option>
                  <option value="Omera 5.5 Kg Cylidner">
                    Omera 5.5 Kg Cylidner
                  </option>
                  <option value="Omera 12 Kg Gas">Omera 12 Kg Gas</option>
                  <option value="Omera 12 Kg Cylidner">
                    Omera 12 Kg Cylidner
                  </option>
                  <option value="Omera 25 Kg Gas">Omera 25 Kg Gas</option>
                  <option value="Omera 25 Kg Cylidner">
                    Omera 25 Kg Cylidner
                  </option>
                  <option value="Omera 35 Kg Gas">Omera 35 Kg Gas</option>
                  <option value="Omera 35 Kg Cylidner">
                    Omera 35 Kg Cylidner
                  </option>
                  <option value="Omera 45 Kg Gas">Omera 45 Kg Gas</option>
                  <option value="Omera 45 Kg Cylidner">
                    Omera 45 Kg Cylidner
                  </option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Product Type:
                </label>
                <select
                  class="form-select form-select-lg mb-3"
                  aria-label=".form-select-lg example"
                  value={formData.product_type}
                  onChange={(e) =>
                    setFormData({ ...formData, product_type: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option value="single">Single</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Product Category:
                </label>
                <select
                  class="form-select form-select-lg mb-3"
                  aria-label=".form-select-lg example"
                  value={formData.product_category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_category: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Please Select
                  </option>
                  <option value="Gas">Gas</option>
                  <option value="Cylinder">Cylinder</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Unit Price:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="last_name"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unit: e.target.value,
                    })
                  }
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Brand:
                </label>
                <select
                  class="form-select form-select-lg mb-3"
                  aria-label=".form-select-lg example"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                >
                  <option value="">Please Select</option>
                  <option value="Omera">Omera</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Quantity:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="last_name"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: e.target.value,
                    })
                  }
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          {alert && (
            <Alert type="success" message="Product Added Successfully" />
          )}
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
      <div className="pad"></div>
    </div>
  );
}

export default AddProducts;
