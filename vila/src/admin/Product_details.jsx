import React, { useEffect, useState } from 'react'
import Anav from './Anav'
import axios from 'axios'

function Product_details() {

    useEffect(() => {
        handlecheck();
    }, [])

    const handlecheck = async () => {
        const res = await axios.get("http://localhost:3000/properties_detail")
        setdata(res.data)
    }
    const [data, setdata] = useState([])
    const [editData, seteditData] = useState("")
    const [showModal, setshoeModal] = useState(false)

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/properties_detail/${id}`);

            // Remove the item from local state
            setdata(prevData => prevData.filter(item => item.id !== id));

            // Optional: show a success message
            toast.success("Item deleted successfully");
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete item");
        }
    };
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/properties_detail/${editData.id}`, editData);
      toast.success("Item updated successfully");
      setshoeModal(false);
      handlecheck(); // Refresh data
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update item");
    }
  };

    const handleEdit = (item) => {
        seteditData(item);
        setshoeModal(true);
    }

    const handleChange=()=>{
        seteditData({
            ...editData,
            [e.target.name]:e.target.value
        });
    }
    return (
        <div>
            <Anav />
            <div className="inquiry-container">
                <h2>Details Data</h2>
                {
                    <table className="details-table">
                        <thead>
                            <tr>
                                <th>image</th>
                                <th>category</th>
                                <th>space</th>
                                <th>floor</th>
                                <th>rooms</th>
                                <th>parking</th>
                                <th>payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td><img src={item.image} alt="img" width="100" /></td>
                                    <td>{item.category}</td>
                                    <td>{item.space}</td>
                                    <td>{item.floor}</td>
                                    <td>{item.rooms}</td>
                                    <td>{item.parking}</td>
                                    <td>{item.payment}</td>
                                    <td>


                                        <button className="btn" onClick={() => handleEdit(item)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {
                            showModal && editData && (
                                <div class="modal">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Data</h1>
                                                <button type="button" class="btn-close" onClick={() => setshoeModal(false)}></button>
                                            </div>
                                            <div class="modal-body">
                                                <input type="text" name="image" value={editData.image} onChange={handleChange} placeholder="Image URL" />
                                                <input type="text" name="category" value={editData.category} onChange={handleChange} />
                                                <input type="text" name="space" value={editData.space} onChange={handleChange} />
                                                <input type="text" name="floor" value={editData.floor} onChange={handleChange} />
                                                <input type="text" name="rooms" value={editData.rooms} onChange={handleChange} />
                                                <input type="text" name="parking" value={editData.parking} onChange={handleChange} />
                                                <input type="text" name="payment" value={editData.payment} onChange={handleChange} />
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setshoeModal(false)}>Close</button>
                                                <button type="button" class="btn btn-primary" onSubmit={handleUpdate}>Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </table>
                }

            </div>
        </div>
    )
}

export default Product_details
