import React from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Form, Input, Button, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

//i18n
import { useTranslation } from 'react-i18next';

//Import Images
import logo_big from "../../assets/images/logo-big.png";
import avatar1 from "../../assets/images/favicon.ico";

function LockScreen(props) {

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  // validation
  const formik = useFormik({
    initialValues: {
      password: 'test'
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Please Enter Your Password')
    }),
    onSubmit: values => {
    },
  });

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-4">
              <Link to="/" className="auth-logo mb-5 d-block">
                <img src={logo_big} alt="" height="30" className="logo logo-light" />
              </Link>

              <h4>{t('Lock screen')}</h4>
              <p className="text-muted mb-4">{t('Enter your password to unlock the screen!')}</p>
                            
            </div>

            <Card>
              <CardBody className="p-4">
                <div className="p-3">
                  <div className="user-thumb text-center mb-4">
                    <img src={avatar1} className="rounded-circle img-thumbnail avatar-lg" alt="thumbnail" />
                    <h5 className="font-size-15 mt-3">{t('Patricia Smith')}</h5>
                  </div>
                  <Form onSubmit={formik.handleSubmit}>

                    <FormGroup className="mb-4">
                      <label>{t('Password')}</label>
                      <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                        <InputGroupAddon addonType="prepend">
                          <span className="input-group-text border-light text-muted">
                            <i className="ri-lock-2-line"></i>
                          </span>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control bg-soft-light border-light"
                          placeholder="Enter Password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                          invalid={formik.touched.password && formik.errors.password ? true : false}
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <FormFeedback type="invalid">{formik.errors.password}</FormFeedback>
                        ) : null}
                                                
                      </InputGroup>
                    </FormGroup>

                    <div>
                      <Button color="primary" block className=" waves-effect waves-light" type="submit">Unlock</Button>
                    </div>

                  </Form>
                </div>
              </CardBody>
            </Card>

            <div className="mt-5 text-center">
              <p>{t('Not you')} ? {t('return')} <Link to="login" className="font-weight-medium text-primary"> {t('Signin')} </Link> </p>
              <p>© {t('2020 Chatvia')}. {t('Crafted with')} <i className="mdi mdi-heart text-danger"></i> {t('by Themesbrand')}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    </React.Fragment>
  );
}

export default LockScreen;