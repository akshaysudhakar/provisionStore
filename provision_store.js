document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const ul = document.createElement('ul');
    document.body.appendChild(ul);

    form.addEventListener('submit', handleSubmit);

    // Fetch data from the server and display it
    axios.get('https://crudcrud.com/api/7893172c6b94481eb0ebe6e5a8bf4cfd/provisionProject')
        .then(res => {
            res.data.forEach(item => {
                displayItem(item);
            });
        })
        .catch(err => console.log(err));

    function handleSubmit(event) {
        event.preventDefault();

        // Selecting input values
        const itemName = event.target.item.value;
        const descriptionName = event.target.description.value;
        const priceName = event.target.price.value;
        const quantityName = event.target.quantity.value;

        // Posting data to the server
        const myData = {
            item_name: itemName,
            description_name: descriptionName,
            price_name: priceName,
            quantity_name: quantityName
        };

        axios.post('https://crudcrud.com/api/7893172c6b94481eb0ebe6e5a8bf4cfd/provisionProject', myData)
            .then(res => {
                displayItem(res.data);
            })
            .catch(err => console.log(err));
    }

    function displayItem(item) {
        // Creating list item and text nodes
        const li = document.createElement('li');
        li.textContent = `${item.item_name} ${item.description_name} ${item.price_name} ${item.quantity_name}`;
        
        // Storing the item ID in the list item
        li.dataset.id = item._id;

        // Creating buy1 button
        const buy1Button = document.createElement('button');
        buy1Button.textContent = 'Buy1';
        buy1Button.onclick = function() {
            const id = li.dataset.id;
            const currentQuantity = item.quantity_name;
            if (id) {
                buyFunction(id, currentQuantity, li, item);
            } else {
                console.error('ID not found');
            }
        };

        //create a delete1 button
        const delete1Button = document.createElement('button');
        delete1Button.textContent = 'delete';
        delete1Button.onclick = function() {
            const id = li.dataset.id;
            axios.delete(`https://crudcrud.com/api/7893172c6b94481eb0ebe6e5a8bf4cfd/provisionProject/${id}`)
            .then((res)=> {console.log(res)
            ul.removeChild(li)
            })
            .catch((err)=>console.log(err))


        };

        // Appending button to list item and list item to ul
        li.appendChild(buy1Button);
        li.appendChild(delete1Button);
        ul.appendChild(li);
    }

    function buyFunction(id, currentQuantity, li, item) {
        // Convert current quantity to a number and decrement it
        let newQuantity = Number(currentQuantity) - 1;

        // Ensure newQuantity is not negative
        if (newQuantity < 0) {
            console.error('Quantity cannot be less than 0');
            return;
        }

        // Update data with the new quantity
        const updatedData = {
            item_name: item.item_name,
            description_name: item.description_name,
            price_name: item.price_name,
            quantity_name: newQuantity.toString() // Convert back to string if needed
        };

        axios.put(`https://crudcrud.com/api/7893172c6b94481eb0ebe6e5a8bf4cfd/provisionProject/${id}`, updatedData)
            .then(res => {
                console.log('Item updated successfully:', res.data);
                // Update the displayed quantity in the list item
                li.firstChild.textContent = `${item.item_name} ${item.description_name} ${item.price_name} ${updatedData.quantity_name}`;
                item.quantity_name = updatedData.quantity_name; // Update the item object
            })
            .catch(err => console.log('Error updating item:', err));
    }
});


