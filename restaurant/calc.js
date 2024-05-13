class Order{
    constructor(dishName, price){
        this.dishName = dishName;
        this.price = price;
    }
}
class OrderManager{
    constructor(){
        this.orders = []; // empty array to hold orders
    }
    addOrder(order){
        this.orders.push(order) // passes the orders to the array
    }
    total(){
        let totalPrice = 0; //initialize the prices
        for (let i = 0; this.orders.length > i; i++){
            totalPrice += this.orders[i].price; // 
        }
        return totalPrice
    }
}


const order1 = new Order('Arroz de Pato', 12)
const order2 = new Order('Caril de frango', 13)
const order3 = new Order('Caramao frito', 15)


const orderManager = new OrderManager();
orderManager.addOrder(order1);
orderManager.addOrder(order2);
orderManager.addOrder(order3);


const totalAmount = orderManager.total()

console.log('total Price is', totalAmount)