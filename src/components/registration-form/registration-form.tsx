import * as React from "react";

import { DateComponent } from "../date-component/date-component";
import { EmailComponent } from "../email-component/email-component";
import { LoginOptionsView } from "../options-component/options-component";
import { UsernameComponent } from "../username-component/username-component";
import { PasswordComponent } from "../password-component/password-component";
import { FieldStatus } from "../../shared/contracts/field-status";
import {
    isMonthValid,
    isDayValid,
    isYearValid,
    isEmailValid,
    isUsernameOrPasswordValid
} from "../../shared/helpers/registration-form-helpers";
import { SignOptions } from "../../shared/contracts/signup-options";

type Dictionary<TFields, TValue> = { [TKey in keyof TFields]: TValue };

interface FormFields {
    username: string;
    password: string;
    day: string;
    month: string;
    year: string;
    email: string;
}

interface State {
    inputDict: Inputs<string>;
    inputErrorDict: Inputs<string>;
    validFields: Dictionary<UserDto, FieldStatus>;
    formFields: UserDto;
    formValid: boolean;
}

interface Props {
    setOption(option: SignOptions, event: React.MouseEvent<HTMLLIElement>): void;
    option: SignOptions;
}

export class RegistrationFormView extends React.Component<Props, State> {
    public state: State = {
        inputDict: {},
        inputErrorDict: {},
        validFields: {
            day: FieldStatus.Initialized,
            month: FieldStatus.Initialized,
            year: FieldStatus.Initialized,
            email: FieldStatus.Initialized,
            password: FieldStatus.Initialized,
            username: FieldStatus.Initialized
        },
        formFields: {
            day: "",
            month: "0",
            year: "",
            email: "",
            password: "",
            username: ""
        },
        formValid: false
    };

    private onFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const fieldName = event.currentTarget.name;
        const fieldValue = event.currentTarget.value;

        this.setState(state => {
            state.formFields[fieldName] = fieldValue;
            return RegistrationFormView.calculateState(state);
        });
    };

    private static calculateState(state: State): State {
        const nextState: State = {
            ...state,
            validFields: {
                username: isUsernameOrPasswordValid(state.formFields.username, 3),
                password: isUsernameOrPasswordValid(state.formFields.password, 7),
                month: isMonthValid(state.formFields.month),
                day: isDayValid(state.formFields.day, state.formFields.month, state.formFields.year),
                year: isYearValid(state.formFields.year),
                email: isEmailValid(state.formFields.email)
            }
        };

        nextState.formValid = Object.keys(nextState.validFields)
            .map(x => nextState.validFields[x])
            .every(x => x === FieldStatus.Correct);
        return nextState;
    }

    private onFormSubmit: React.MouseEventHandler<HTMLFormElement> = event => {
        event.preventDefault();

        console.info("fields", this.state.formFields);
    };

    private getFieldName(name: keyof FormFields): string {
        return name;
    }

    public render(): JSX.Element {
        return (
            <form className="registration-container" onSubmit={this.onFormSubmit}>
                <LoginOptionsView setOption={this.props.setOption} option={this.props.option} />
                <div className="container user-details-container">
                    <UsernameComponent
                        onChange={this.onFieldChange}
                        name={this.getFieldName("username")}
                        value={this.state.formFields.username}
                        fieldStatus={this.state.validFields.username}
                        option={this.props.option}
                    />
                    <PasswordComponent
                        name={this.getFieldName("password")}
                        value={this.state.formFields.password}
                        onChange={this.onFieldChange}
                        fieldStatus={this.state.validFields.password}
                        option={this.props.option}
                    />
                    <DateComponent
                        onInputChange={this.onFieldChange}
                        onSelectChange={this.onFieldChange}
                        dayInputName={this.getFieldName("day")}
                        monthInputName={this.getFieldName("month")}
                        yearInputName={this.getFieldName("year")}
                        dayValue={this.state.formFields.day}
                        monthValue={this.state.formFields.month}
                        yearValue={this.state.formFields.year}
                        dayFieldStatus={this.state.validFields.day}
                        monthFieldStatus={this.state.validFields.month}
                        yearFieldStatus={this.state.validFields.year}
                    />
                    <EmailComponent
                        name={this.getFieldName("email")}
                        value={this.state.formFields.email}
                        onChange={this.onFieldChange}
                        fieldStatus={this.state.validFields.email}
                    />
                    <div className="tos-button">
                        <div className="tos">
                            By clicking Sign Up, you are indicating that you have read and agree to the
                            <a href="https://www.twitch.tv/p/legal/terms-of-service/">Terms of Service</a>
                            and
                            <a href="https://www.twitch.tv/p/legal/privacy-policy/">Privacy Policy.</a>
                        </div>
                        <input
                            className={this.state.formValid ? "sign-up enabled" : "sign-up disabled"}
                            type="submit"
                            value="Sign Up"
                            disabled={!this.state.formValid}
                        />
                    </div>
                </div>
            </form>
        );
    }
}
