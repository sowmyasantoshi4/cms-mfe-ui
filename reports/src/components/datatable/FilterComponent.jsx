import React from 'react';
import { Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Styled input for search field
const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

// Styled clear button
const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Filter component with FontAwesome icons and React-Bootstrap
const FilterComponent = ({ filterText, onFilter, onClear, isDisabled }) => (
  <>
    <Row>
      <Col md={12}>
        <InputGroup size="sm">
          <InputGroup.Text id="inputGroup-sizing-sm">
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <Form.Control
            id="search"
            type="text"
            placeholder="Search..."
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
            disabled={isDisabled}
          />
          <Button variant="outline-secondary" onClick={onClear} disabled={isDisabled}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </InputGroup>
      </Col>
    </Row>
  </>
);

export default FilterComponent;
