import React from 'react';
import {
    Collapse,
    Form,
    FormGroup,
    Label,
    Input,
    Navbar,
    NavbarBrand
} from 'reactstrap';

const Header = () =>
    <div className="Header">
        <Navbar
            color="inverse"
            inverse
            toggleable
        >
            <NavbarBrand href="/">
                {'Node MakeMKV'}
            </NavbarBrand>
            <Collapse navbar>
                <Form inline>
                    <FormGroup>
                        <Label for="saveDirectory">
                            {'Save Directory'}
                        </Label>
                        <Input
                            id="saveDirectory"
                            type="text"
                        />
                    </FormGroup>
                </Form>
            </Collapse>
        </Navbar>
    </div>;

Header.propTypes = {
};

Header.defaultProps = {
};

export default Header;
