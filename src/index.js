const { GraphQLServer } = require('graphql-yoga')

// some dummy data
let Shops = [{
    id: 'Shop-0',
    name: 'walmart',
    orders: [],
    products: [{
        id: "walmart-0",
        name: "coffee",
        listItems: [{
            name: "milk",
            prize: 5
        }, {
            name: "coffee",
            prize: 10
        }]
    }, {
        id: "walmart-1",
        name: "bread",
        listItems: [{
            name: "bread",
            prize: 7
        }]
    }]
}]

let User = [
    {
        id: "user-0",
        name: "Leo",
        orders: []
    },
    {
        id: "user-1",
        name: "Michael",
        orders: []
    }

]

const resolvers = {
    Query: {
        Shops: () => Shops,
        Users: () => User
    },
    Shop: {
        id: (root) => root.id,
        name: (root) => root.name,
        products: (root) => root.products,
        orders: (root) => root.orders
    },
    Product: {
        id: (root) => root.id,
        name: (root) => root.name,
        prize: (root) => {
            let prize = 0;
            root.listItems.forEach((listItem) => {
                prize += listItem.prize;
            })
            return prize;
        },
        listItems: (root) => root.listItems,
    },
    Order: {
        id: (root) => root.id,
        prize: (root) => {
            let prize = 0;
            root.listItems.forEach((listItem) => {
                prize += listItem.prize;
            })
            return prize;
        },
        listItems: (root) => root.listItems
    },
    ListItem:{
        name: (root) => root.name,
        prize: (root) => root.prize,
    },
    User:{
        id: (root) => root.id,
        name: (root) => root.name,
        orders: (root) => root.orders
    },
    Mutation:{ 
        placeOrder: (root, args) => {
            let user = User.find(user =>  user.id == args.UserID);
            let shop = Shops.find(shop =>  shop.id == args.ShopID);
            let products = [];
            args.Products.forEach((productID) => {products.push(shop.products.find(product =>  product.id == productID))});
            const order = {
                id:shop.name+shop.orders.length,
                listItems:[]
            }
            products.forEach((product) => {
                order.listItems = order.listItems.concat(product.listItems);
            });
            shop.orders.push(order);
            user.orders.push(order);
            return order;
        }
        
    }
}

const server = new GraphQLServer({
    typeDefs: "./src/shopifySchema.graphql",
    resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))