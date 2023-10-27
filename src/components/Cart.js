import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { CartState } from "../context/Context";
import Rating from "./Rating";

const Cart = () => {
  const navigate = useNavigate();
  const { state: { cart }, dispatch } = CartState();
  const [total, setTotal] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/coupons")
      .then((response) => response.json())
      .then((data) => {
        setCoupons(data);
      });
  }, []);

  useEffect(() => {
    const coupon = coupons.find((coupon) => coupon.code === selectedCoupon);
    if (coupon) {
      setDiscount(total * (coupon.discountPercentage / 100));
      setErrorMessage("");
    } else {
      setDiscount(0);
      if (selectedCoupon !== "") {
        setErrorMessage("Invalid coupon code. Please try again.");
      }
    }

    setTotal(
      cart.reduce((acc, curr) => acc + Number(curr.price) * curr.qty, 0) - discount
    );
  }, [cart, selectedCoupon, total, coupons, discount]);

  const handleApplyCoupon = () => {
    const coupon = coupons.find((coupon) => coupon.code === selectedCoupon);
    if (coupon) {
      setDiscount(total * (coupon.discountPercentage / 100));
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid coupon code. Please try again.");
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      setCheckoutMessage("Your cart is empty. Please add items to proceed.");
    } else {
      // Clear the cart by dispatching an action
      dispatch({
        type: "CLEAR_CART",
      });
      setCheckoutMessage("Redirecting to checkout page...");
      navigate("/cart/Checkout");
    }
  };

  return (
    <div className="home">
      <div className="productContainer">
        <ListGroup>
          {cart.map((prod) => (
            <ListGroup.Item key={prod.id}>
              <Row>
                <Col md={2}>
                  <Image src={prod.image} alt={prod.name} fluid rounded />
                </Col>
                <Col md={2}>
                  <span>{prod.name}</span>
                </Col>
                <Col md={2}>₹ {prod.price}</Col>
                <Col md={2}>
                  <Rating rating={prod.ratings} />
                </Col>
                <Col md={2}>
                  <Form.Control
                    as="select"
                    value={prod.qty}
                    onChange={(e) =>
                      dispatch({
                        type: "CHANGE_CART_QTY",
                        payload: {
                          id: prod.id,
                          qty: e.target.value,
                        },
                      })
                    }
                  >
                    {[...Array(prod.inStock).keys()].map((x) => (
                      <option key={x + 1}>{x + 1}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: prod,
                      })
                    }
                  >
                    <AiFillDelete fontSize="20px" />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>{" "}
      <div className="filters summary">
        <Form.Group controlId="couponCode">
          <Form.Label>Select Coupon</Form.Label>
          <Form.Control
            as="select"
            value={selectedCoupon}
            onChange={(e) => setSelectedCoupon(e.target.value)}
          >
            <option value="">Select a coupon</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.code}>
                {coupon.code}
              </option>
            ))}
          </Form.Control>
          {errorMessage && <Form.Text className="text-danger">{errorMessage}</Form.Text>}
        </Form.Group>
        <Button type="button" variant="info" onClick={handleApplyCoupon}>
          Apply Coupon
        </Button>
        <span className="title">Subtotal ({cart.length}) items</span>
        <span style={{ fontWeight: 700, fontSize: 20 }}>Total: ₹ {total.toFixed(2)}</span>
        <Button type="button" disabled={cart.length === 0} onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </Button>
        {checkoutMessage && <div className="checkout-message">{checkoutMessage}</div>}
      </div>
    </div>
  );
};

export default Cart;
