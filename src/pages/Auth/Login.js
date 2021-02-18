import React, {useEffect} from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Alert, Form, Input, Button, FormFeedback, Label, InputGroup, InputGroupAddon } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import config from '../../config';

//i18n
import { useTranslation } from 'react-i18next';

//redux store
import { loginUser, apiError } from '../../redux/actions';

//Import Images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";

/**
 * Login component
 * @param {*} props 
 */
const Login = (props) => {

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const clearError = () => {
    props.apiError("");
  }
  
  useEffect(() => {
    if (props.error)
      setTimeout(clearError, 3000);
  }, [props.error]);

  // validation
  const formik = useFormik({
    initialValues: {
      email: 'magic0619',
      password: '1234567890'
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Username'),
      password: Yup.string().required('Please Enter Your Password')
    }),
    onSubmit: values => {
      props.loginUser(values.email, values.password, props.history);
    },
  });

  if (localStorage.getItem("authUser")) {
    return <Redirect to="/" />;
  } 

  return (
    <React.Fragment>

    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5} >
            <div className="text-center mb-4">
              <span className="auth-logo mb-5 d-block">
                <img src={logodark} alt="" height="30" className="logo logo-dark"/>
                <img src={logolight} alt="" height="30" className="logo logo-light" />
              </span>

              <h4>{t('Sign in')}</h4>
              <p className="text-muted mb-4">Sign in to continue to RBChat</p>
              
            </div>

            <Card>
              <CardBody className="p-4">
                    {
                      props.error && <Alert color="danger">{props.error}</Alert>
                    }
                <div className="p-3">
                    
                  <Form onSubmit={formik.handleSubmit}>
  
                    <FormGroup>
                      <Label>Username</Label>
                      <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                        <InputGroupAddon addonType="prepend">
                          <span className="input-group-text border-light text-muted">
                            <i className="ri-user-2-line"></i>
                          </span>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          id="email"
                          name="email"
                          className="form-control bg-soft-light border-light"
                          placeholder="Enter username"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          invalid={formik.touched.email && formik.errors.email ? true : false}
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
                        ) : null}
                      </InputGroup>
                    </FormGroup>

                    <FormGroup className="mb-4">
                      {/* <div className="float-right">
                        <Link to="forget-password" className="text-muted font-size-13">{t('Forgot password')}?</Link>
                      </div> */}
                      <Label>{t('Password')}</Label>
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

                    <div className="custom-control custom-checkbox mb-4">
                      <Input type="checkbox" className="custom-control-input" id="remember-check" />
                      <Label className="custom-control-label" htmlFor="remember-check">{t('Remember me')}</Label>
                    </div>

                    <div>
                      <Button color="primary" block className=" waves-effect waves-light" type="submit">{t('Sign in')}</Button>
                    </div>

                  </Form>
                </div>
              </CardBody>
            </Card>

            <div className="mt-5 text-center">
              <p>{t("Don't have an account")} ? <a href={config.RB_SERVER} target="_blank" className="font-weight-medium text-primary"> {t('Signup now')} </a> </p>
              <p>© 2021 RB Corporation</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    </React.Fragment>
  )
}


const mapStateToProps = (state) => {
  const { user, loading, error } = state.Auth;
  return { user, loading, error };
};

export default withRouter(connect(mapStateToProps, { loginUser, apiError })(Login));