const knex = require('../database');


module.exports = {

    // Cadastrando pedido 

    async create(request, response, next) {
        try {

            let prices = [];

            // função que calcula o preço do produto 
            // de acordo com quantidade solicitada, 
            // e armazena a informação em um array  

           const calc = (amount, id_products) => {

               const { price } = products.find(e => {
                   if(e.id == id_products) {
                       return e.price
                   }
               })
               
               prices.push(price * amount)

           }
        
           const elements = request.body;


           const products = await knex('products')
           .where('id_company', elements.order.id_company)
           .select('id', 'price');


           const trx = await knex.transaction();


           const id_order = await trx('orders')
           .returning('id')
           .insert(elements.order);


           const data = elements.items_order.map(itens => { 

                calc(itens.amount, itens.id_products)

                return {
                    "id_order": id_order[0],
                    "id_product": itens.id_products,
                    "amount": itens.amount,
                    "details": itens.details
                }  

            });


           await trx('items_order').insert(data)


            // Calculando o total do pedido

            const total = prices.reduce((total, prices) => total + prices, 0)

            if(elements.order.receivement !== "Retirar") {                
                const id_address = await trx('addresses')
                .returning('id')
                .insert(elements.address);

                await trx('orders').where('id', id_order[0])
                .update({
                    'id_address': id_address[0], 
                    'total': total
                });

                await trx.commit();

            }else{                
                await trx('orders').where('id', id_order[0])
                .update({'total': total});

                await trx.commit();

            }
        
           return response.status(201).send();

            
        } catch (error) {
            next(error)
        }
    },


    // Listar pedidos de uma empresa

    async index(request, response, next) {
        try {

            const { id_company } = request.params;

            const orders = await knex('orders')
            .where({ id_company,})
            .whereIn('status', ['Fazendo','Solicitado'])
            .join('clients', 'clients.id', 'orders.id_client')
            .orderBy([{column : 'status', order: 'desc'}, {column : 'order_date', order: 'asc'}])
            .select('clients.name', 'orders.id', 'orders.status');

            response.status(200).json(orders)

            
        } catch (error) {
            next(error)
        }
    },


    // Calculando o fatoramento do dia

    async indexForIncome(request, response, next) {
        try {

            const { id_company } = request.params;

            const orders = await knex('orders')
            .where({ 
                id_company,
                "status": "Finalizado" 
            })
            .orderBy('order_date', 'desc')
            .select('total', 'order_date');

            // console.log(orders);
            

            const groups = orders.reduce((groups, income) => {
                const date = new Date(income.order_date).toLocaleDateString();
                // const sp = Date(date).split('T')[0];
                if(!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(parseFloat(income.total));
                return groups;
            }, {});
            
 

            const groupArrays = Object.keys(groups).map((order_date) => {
                return {
                    order_date,
                    income: groups[order_date]
                };
            });

            for(i = 0; i < groupArrays.length; i++) {
                const total = Object.values(groupArrays[i].income).reduce((previous, current) => {
                    return previous + current;
                });

                groupArrays[i].income = total

            }

            
            response.status(200).json(groupArrays);

            
        } catch (error) {
            next(error)
        }
    },


    // Detalhando pedido

    async show(request, response, next) {
        try {

            const { id_order } = request.query;


            const orders = await knex('orders')
            .join('clients', 'clients.id', 'orders.id_client')
            .select('clients.name', 'clients.cell', 'orders.total', 'orders.payment', 'orders.receivement', 'orders.id_address', 'orders.id', 'orders.status');


            const order = orders.filter(e => e.id == id_order);


            const itens_order = await knex('items_order')
            .where({ id_order })
            .join('products', 'products.id', 'items_order.id_product')
            .select( 'products.name', 'products.description', 'products.price', 'products.img_url', 'items_order.amount', 'items_order.details');

            if(order[0].receivement !== "Retirar") {
                
                const address = await knex('addresses')
                .where('id', orders[0].id_address)
                .select('street', 'neighborhood', 'ad_number', 'additional', 'landmark');
    
                
                return response.status(200).json({
                    "Order": order[0],
                    "Address": address[0],
                    "Items": itens_order
                })

            }else{

                return response.status(200).json({
                    "Order": order[0],
                    "Items": itens_order
                })
            }

            
        } catch (error) {
            next(error)
        }
    },


    // Atualizar status do pedido (Aceito / Cancelado / Finalizado)

    async update(request, response, next) {
        try {
            
            const { id_order } = request.query;
    
            const { status } = request.body;
    
            await knex('orders').where('id', id_order)
            .update({ status });
    
            response.status(200).send();

        } catch (error) {

            next(error)
            
        }

    }




    
}