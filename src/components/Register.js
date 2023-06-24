import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import axios from '../api/axios';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = '/register';


const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("invalid entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL, JSON.stringify([user, pwd]),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
            // Clear input fields
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (err.response.status === 409) {
                setErrMsg('Username: taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <section>
                <div className="logs">
                    <Container>
                        {success ? (
                            <Row>
                                <Col>
                                    <h1>You are now registered!</h1>
                                    <p><a href="/">Sign in</a></p>
                                </Col>
                            </Row>
                        ) : (

                            <Row>
                                <Col>
                                    <h1>OKBet Sports</h1>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </Col>
                                <Col>
                                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                                        {errMsg}
                                    </p>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label htmlFor="username">
                                                Username :&nbsp;
                                                <span className={validName ? "valid" : "hide"}>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </span>
                                                <span className={validName || !user ? "hide" : "invalid"}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="username"
                                                ref={userRef}
                                                autoComplete="off"
                                                onChange={(e) => setUser(e.target.value)}
                                                required
                                                aria-invalid={validName ? "false" : "true"}
                                                aria-describedby="uidnote"
                                                onFocus={() => setUserFocus(true)}
                                                onBlur={() => setUserFocus(false)}
                                            />
                                            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 chracters. <br />
                                                Must begin with a letter. <br />
                                                Letter, numbers, underscore, hypen allowed.
                                            </p>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label htmlFor="password">
                                                Password :&nbsp; A@345asd
                                                <span className={validPwd ? "valid" : "hide"}>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </span>
                                                <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </span>
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                id="password"
                                                autoComplete="off"
                                                onChange={(e) => setPwd(e.target.value)}
                                                required
                                                aria-invalid={validPwd ? "false" : "true"}
                                                aria-describedby="pwdnote"
                                                onFocus={() => setPwdFocus(true)}
                                                onBlur={() => setPwdFocus(false)}
                                            />
                                            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 chracters. <br />
                                                Must include uppercase and lowercase letters, a number and special character.. <br />
                                                Allowed special character: <span aria-label="exclamation mark">!</span> <span aria-label="dollar sign">$</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
                                            </p>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label htmlFor="confirm_pwd">
                                                Confirm Password :&nbsp;
                                                <span className={validMatch && matchPwd ? "valid" : "hide"}>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </span>
                                                <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </span>
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                id="confirm_pwd"
                                                autoComplete="off"
                                                onChange={(e) => setMatchPwd(e.target.value)}
                                                required
                                                aria-invalid={validMatch ? "false" : "true"}
                                                aria-describedby="confirmnote"
                                                onFocus={() => setMatchFocus(true)}
                                                onBlur={() => setMatchFocus(false)}
                                            />
                                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} /> Must match the first password field.
                                            </p>
                                        </Form.Group>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={!validName || !validPwd || !validMatch ? true : false}
                                        >
                                            Sign up
                                        </Button>

                                        <p className="mt-4">
                                            Already registered? <br />
                                            <span className="line">
                                                <a href="#">Sign in</a>
                                            </span>
                                        </p>
                                    </Form>

                                </Col>
                            </Row>

                        )}
                    </Container>
                </div>
            </section>
        </>
    )
}

export default Register;