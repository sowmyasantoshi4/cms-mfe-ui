import { Col, Row, Alert, ListGroup } from 'react-bootstrap';
import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { getLocalStorageOrDefault } from '../utils/ValidationUtils';

const PackageStatus = (props) => {
  const [sd, setSd] = useState(props.statusData);
  let displayStatus = props.displayStatus || false;
  let currStatusId = props.currentStatusId;

  useEffect(() => {
    let stLen = sd.length;
    let extraSt = [];
    let finalSt = [];
    if (stLen < 4) {
      let statusList = getLocalStorageOrDefault("statusList");
      if (statusList) {
        statusList = statusList.filter((obj) => {
          return obj.statusId > stLen && obj.statusId <= 4;
        });
        statusList.map((key) => {
          extraSt.push({
            statusId: key.statusId,
            statusName: key.statusName,
            statusUpdatedOn: '',
            remarks: '',
          });
        });
      }
      finalSt = [...sd, ...extraSt];
      setSd(finalSt);
    }
  }, []);

  return (
    <fieldset className='bg-light'>
      <legend className='alert alert-primary px-2 py-1'>Status Updates</legend>
      <Row>
        <Col xs={11} md={11}>
        <ListGroup>
            {sd.map((key, index) => {
              let updatedOn = key.statusUpdatedOn;
              let fontCss = updatedOn ? "text-success" : 'text-warning';
              let latestCss = (currStatusId === key.statusId) ? "fw-bold" : '';
              let isLatest = (currStatusId === key.statusId) ? true : false;

              return (
                <ListGroup.Item key={index} className={`d-flex align-items-center ${isLatest ? '' : ''}`}>
                  {updatedOn ? (
                    isLatest ? (
                      <span className={`timeline-icon border border-2 border-success alert alert-success me-2`}>
                        <FontAwesomeIcon icon={faCheck} className='text-success fa-sm fa-fw' />
                      </span>
                    ) : (
                      <span className={`timeline-icon border border-1 border-info alert alert-info me-2`}>
                        <FontAwesomeIcon icon={faCheck} className='text-info fa-sm fa-fw' />
                      </span>
                    )
                  ) : (
                    <span className="timeline-icon border border-1 border-warning alert alert-warning me-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} className='text-warning fa-sm fa-fw' />
                    </span>
                  )}
                  <div className='flex-grow-1'>
                    <h6 className={`${latestCss} ${fontCss}`}>{key.statusName}</h6>
                    <p className="text-muted m-0 fw-bold">
                      {updatedOn && (
                        <Moment format="MM/DD/YYYY hh:mm A">{updatedOn}</Moment>
                      )}
                    </p>
                    <p className="text-muted m-0">{key.remarks}</p>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    </fieldset>
  );
}

export default PackageStatus;
