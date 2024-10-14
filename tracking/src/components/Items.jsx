import { Button, Col, Form, Row, Table, FormFeedback } from 'react-bootstrap';
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Items = (props) => {
  let items = props.items || [];
  let errors = props.errors;
  let errorCss = props.errorCss;
  let displayItems = props.displayItems || false;

  let totPrice = 0;

  return (
    <fieldset className='bg-light'>
      <legend className='alert alert-primary px-2 py-1'> Item Details </legend>
      <Row>
        <Col md={12}>
          <Table hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Width</th>
                <th>Price</th>
                {!displayItems && (
                  <th className='text-center'>
                    <Button variant="warning" onClick={props.addItem}>
                      <FontAwesomeIcon icon={faPlusCircle} />  
                    </Button>
                  </th>
                )}
              </tr>
            </thead>
            {displayItems ? (
              <>
                <tbody>
                  {items.map((key, index) => {
                    totPrice += Number(key.price);
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{key.itemName}</td>
                        <td>{key.height}</td>
                        <td>{key.weight}</td>
                        <td>{key.width}</td>
                        <td>{key.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className='fw-bold'>
                    <td colSpan={4}></td>
                    <td>Total Price</td>
                    <td>{totPrice}</td>
                  </tr>
                </tfoot>
              </>
            ) : (
              <tbody>
                {items.map((key, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Form.Control
                          placeholder="Item Name"
                          autoComplete="item_name"
                          value={key['item_name']}
                          name='item_name'
                          id={`item_name_${index}`}
                          onChange={(e) => props.handleInputChangeItem(e, index)}
                          className={`form-control ${errorCss[index]['item_name']}`}
                          alt={errors[index]['item_name']}
                          title={errors[index]['item_name']}
                          required
                        />
                        {errors && errors[index]['item_name'] && (
                          <FormFeedback type="invalid">{errors[index]['item_name']}</FormFeedback>
                        )}
                      </td>
                      <td>
                        <Form.Control
                          placeholder="Height"
                          autoComplete="height"
                          value={key['height']}
                          name='height'
                          id={`height_${index}`}
                          onChange={(e) => props.handleInputChangeItem(e, index)}
                          className={`form-control ${errorCss[index]['height']}`}
                          alt={errors[index]['height']}
                          title={errors[index]['height']}
                          required
                          type='number'
                        />
                        {errors && errors[index]['height'] && (
                          <FormFeedback type="invalid">{errors[index]['height']}</FormFeedback>
                        )}
                      </td>
                      <td>
                        <Form.Control
                          placeholder="Weight"
                          autoComplete="weight"
                          value={key['weight']}
                          name='weight'
                          id={`weight_${index}`}
                          onChange={(e) => props.handleInputChangeItem(e, index)}
                          className={`form-control ${errorCss[index]['weight']}`}
                          alt={errors[index]['weight']}
                          title={errors[index]['weight']}
                          required
                          type='number'
                        />
                        {errors && errors[index]['weight'] && (
                          <FormFeedback type="invalid">{errors[index]['weight']}</FormFeedback>
                        )}
                      </td>
                      <td>
                        <Form.Control
                          placeholder="Width"
                          autoComplete="width"
                          value={key['width']}
                          name='width'
                          id={`width_${index}`}
                          onChange={(e) => props.handleInputChangeItem(e, index)}
                          className={`form-control ${errorCss[index]['width']}`}
                          alt={errors[index]['width']}
                          title={errors[index]['width']}
                          required
                          type='number'
                        />
                        {errors && errors[index]['width'] && (
                          <FormFeedback type="invalid">{errors[index]['width']}</FormFeedback>
                        )}
                      </td>
                      <td>
                        <Form.Control
                          placeholder="Price"
                          autoComplete="price"
                          value={key['price']}
                          name='price'
                          id={`price_${index}`}
                          onChange={(e) => props.handleInputChangeItem(e, index)}
                          className={`form-control ${errorCss[index]['price']}`}
                          alt={errors[index]['price']}
                          title={errors[index]['price']}
                          required
                          type='number'
                        />
                        {errors && errors[index]['price'] && (
                          <FormFeedback type="invalid">{errors[index]['price']}</FormFeedback>
                        )}
                      </td>
                      <td className='text-center'>
                        <Button variant="danger" onClick={() => props.deleteItem(index)}>
                          <FontAwesomeIcon icon={faTimesCircle} /> 
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </Table>
        </Col>
      </Row>
    </fieldset>
  );
};

export default Items;
