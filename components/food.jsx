"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet"
import { Card, CardContent } from "./ui/card"
import { LocateIcon, PhoneIcon, Trash } from "lucide-react" // Import the Trash component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog"
import { Checkbox } from "./ui/checkbox"

const config = {
  header: {
    title: "Delivefy",
    address: "Rua Principal, 123, Cidade Qualquer, Brasil",
    phone: "(11) 5555-5555"
  },
  banner: {
    title: "Refeições Deliciosas Entregues",
    subtitle: "Explore nosso menu e peça seus pratos favoritos hoje mesmo.",
    imageUrl: "https://www.designi.com.br/images/preview/10066992.jpg",
    signUpButton: "Cadastre-se",
    loginButton: "Entrar"
  }
}

export default function Food() {
  const [restaurant, setRestaurant] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [cart, setCart] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [selectedExtras, setSelectedExtras] = useState([])

  useEffect(() => {
    fetch("/api/restaurant")
      .then(response => response.json())
      .then(data => {
        setRestaurant(data)
        if (data.categories.length > 0) {
          setSelectedCategory(data.categories[0].id)
        }
      })
      .catch(error => console.error("Error fetching restaurant data:", error))
  }, [])

  const openDialog = meal => {
    setSelectedMeal(meal)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setSelectedMeal(null)
    setSelectedExtras([])
    setIsDialogOpen(false)
  }

  const toggleExtra = extra => {
    setSelectedExtras(prev =>
      prev.includes(extra) ? prev.filter(e => e !== extra) : [...prev, extra]
    )
  }

  const addToCart = () => {
    if (selectedMeal && restaurant) {
      const mealExtras = selectedExtras.map(extraId => {
        const extra = restaurant.extras.find(e => e.id === extraId)
        return extra ? `${extra.name} (+R$${extra.price})` : extraId
      })

      const mealExtrasPrice = selectedExtras.reduce((total, extraId) => {
        const extra = restaurant.extras.find(e => e.id === extraId)
        return total + (extra ? extra.price : 0)
      }, 0)

      const totalPrice = selectedMeal.price + mealExtrasPrice

      setCart(prevCart => [
        ...prevCart,
        {
          name: selectedMeal.name,
          price: totalPrice,
          quantity: 1,
          extras: mealExtras
        }
      ])
      closeDialog()
    }
  }

  const removeFromCart = index => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  if (!restaurant) {
    return <div>Loading...</div>
  }

  return (

    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FF8C00] border-none px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="flex items-center gap-2 text-white"
            prefetch={false}
          >
            <span className="text-lg font-bold">{restaurant.name}</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-white">
            <LocateIcon className="w-4 h-4" />
            <span>{restaurant.address}</span>
            <PhoneIcon className="w-4 h-4" />
            <span>{restaurant.phone}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <div className="text-red-500 bg-white rounded-full w-6 text-center">
              {cart.length}
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="text-white border-white"
              >
                <img src="../cart.png" className="w-6 h-6" />
                <span className="sr-only">Carrinho</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
  <div className="space-y-6 p-6">
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Carrinho</h3>
      <div className="space-y-2">
        {cart.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span>{item.name} ({item.price})</span>
            {item.extras && item.extras.length > 0 && (
              <div className="ml-4 text-sm">
                {item.extras.map((extra, extraIndex) => (
                  <div key={extraIndex} className="flex items-start justify-between">
                    <div>{extra}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold">{item.price}</span>
              <Button
                onClick={() => removeFromCart(index)}
                variant="ghost"
                className="text-red-500"
                size="sm"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <hr />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold">Total</span>
        <span className="font-bold text-lg">R${calculateTotal()}</span>
      </div>
      <Button className="w-full bg-[#FF8C00] text-white">Finalizar Compra</Button>
    </div>
  </div>
</SheetContent>

          </Sheet>
        </div>
      </header>

      <div className="bg-[#FFD700] py-12 md:py-16 lg:py-20 pt-24 md:pt-32">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#4B0082]">
              {config.banner.title}
            </h1>
            <p className="text-[#4B0082] md:text-xl">
              {config.banner.subtitle}
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Button className="bg-[#32CD32] text-white">
                {config.banner.signUpButton}
              </Button>
              <Button
                variant="outline"
                className="border-[#32CD32] text-[#32CD32]"
              >
                {config.banner.loginButton}
              </Button>
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-1/2">
            <img
              src={config.banner.imageUrl}
              alt="Banner Image"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <main className="container py-6 flex-1 mt-20">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <div className="md:sticky md:top-6 overflow-x-auto md:overflow-x-visible pb-4 mb-4 md:pb-0 md:mb-0">
              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                {restaurant.categories.map(category => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    className="flex-shrink-0 md:w-full justify-center md:justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <section className="md:w-3/4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategory &&
                restaurant.categories
                  .find(c => c.id === selectedCategory)
                  ?.meals.map(meal => (
                    <Card key={meal.id}>
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="rounded-t-lg mb-2"
                      />
                      <CardContent className="space-y-2">
                        <div className="h-[60px]">
                        <h3 className="text-lg font-bold">{meal.name}</h3>
                        </div>
                        <div className="h-[70px]">

                        <p>{meal.description}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-bold">
                            R${meal.price}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(meal)}
                          >
                            Adicionar ao carrinho
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-[#FF8C00] text-white text-center py-4">
        © 2024 {restaurant.name}. Todos os direitos reservados.
      </footer>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Selecione Ingredientes Extras
            </DialogTitle>
            <DialogDescription>
              Escolha os ingredientes extras para adicionar à sua refeição.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {restaurant.extras.map(extra => (
              <div key={extra.id} className="flex items-center space-x-2">
                <Checkbox
                  id={extra.id}
                  checked={selectedExtras.includes(extra.id)}
                  onCheckedChange={() => toggleExtra(extra.id)}
                />
                <label
                  htmlFor={extra.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {extra.name} (+R${extra.price})
                </label>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={addToCart} className="bg-[#FF8C00] text-white">
              Adicionar ao Carrinho
            </Button>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
