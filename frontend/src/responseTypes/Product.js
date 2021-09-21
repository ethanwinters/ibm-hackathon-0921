
import { useEffect, useState } from 'react';
import { SkeletonPlaceholder, Tile } from 'carbon-components-react';
import axios from 'axios';
import './Product.css';

function Product({ message }) {
  const [itemData, setItemData] = useState(null);
  useEffect(() => {
    let isMounted = true;
    axios.get(`api/products/${message.user_defined.product_id}`).then(({ data }) => {
      if (isMounted) {
        data.qty = data.inventory.InventoryCountItem.find(item => item.itemID === data.Item.itemID).qty;
        setItemData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Product">
      {!itemData && <SkeletonPlaceholder style={{ width: "100%", height: "250px" }} />}
      {itemData && (
        <>
        <Tile>
          <img
            alt={itemData.imageDetails?.Image.description}
            src={`${itemData.imageDetails?.Image.baseImageURL}${itemData.imageDetails?.Image.publicID}.jpg`}
            style={{ width: "100%" }}
          />
          <strong>{itemData.Item.description}</strong><br />
          <em>{itemData.qty} currently in stock.</em>
        </Tile>
        <br />
        </>
      )}
    </div>
  );
}

export default Product;
