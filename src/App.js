import React, {useState, useEffect} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {Products, Navbar, Cart, Checkout} from './components'
import {commerce} from './lib/commerce'

const App = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const [order, setOrder] = useState({})
  const [errorMessage, setErrorMessage] = useState('')

  const fetchProduct = async () => {
    const {data} = await commerce.products.list()
    setProducts(data)
  }
  useEffect(() => {
    fetchProduct()
    fetchCart()
    setErrorMessage('')
  }, [])

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve())
  }
  const handleAddtoCart = async (productId, quantity) => {
    const {cart} = await commerce.cart.add(productId, quantity)
    setCart(cart)
  }
  const handleUpdateCartQty = async (productId, quantity) => {
    const {cart} = await commerce.cart.update(productId, {quantity})
    setCart(cart)
  }
  const handleRemoveFromCart = async (productId) => {
    const {cart} = await commerce.cart.remove(productId)
    setCart(cart)
  }
  const handleHandleEmptyCart = async () => {
    const {cart} = await commerce.cart.empty()
    setCart(cart)
  }
  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh()
    setCart(newCart)
  }

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      // const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)
      // setOrder(incomingOrder)
      refreshCart()
    } catch (e) {
      setErrorMessage(e.data.error.message)
    }
  }

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items}/>
        <Switch>
          <Route exact path={'/'}>
            <Products products={products} onAddToCart={handleAddtoCart}/>
          </Route>
          <Route exact path={'/checkout'}>
            <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage}/>
          </Route>
          <Route exact path={'/cart'}>
            <Cart cart={cart}
                  onUpdateCartQty={handleUpdateCartQty}
                  onRemoveFromCart={handleRemoveFromCart}
                  onEmptyCart={handleHandleEmptyCart}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
