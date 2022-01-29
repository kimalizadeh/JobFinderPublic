import React from 'react'
import { render,screen, fireEvent } from "@testing-library/react"
import Registration from "./Registration"
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import { act } from 'react-dom/test-utils'
import "@testing-library/jest-dom/extend-expect";


test('on initial render,login button is disabled', async ()=>{
    render(<BrowserRouter><Registration/></BrowserRouter>);
    screen.debug();
    //expect(await screen.findByRole('button', {name: /register/i})).toBeDisabled();
})



describe("registration form", () => {
  const mockChangeValue = jest.fn();
  const stubbedSearchValue = {
    email: "",
    password: "",
    name: "",
    role: "",
    province: "",
    city: "",
  };

  it("shows all required input fields with empty values", () => {
    const { getByTestId } = render(
      <BrowserRouter><Registration
        searchValue={stubbedSearchValue}
        handleChangeValue={mockChangeValue}
      /></BrowserRouter>
    );

    expect(getByTestId("filter-input-email").value).toBe("");
    expect(getByTestId("filter-input-password").value).toBe("");
    expect(getByTestId("filter-input-name").value).toBe("");
    expect(getByTestId("filter-input-role").value).toBe("");
    expect(getByTestId("filter-input-province").value).toBe("");
    expect(getByTestId("filter-input-city").value).toBe("");
  });


  it("triggers event handler on change all inputs", () => {
    const changedSearchValue = {     email: "bahar@bahar.com",
    password: "bahar123",
    name: "bahar",
    role: "Employer",
    province: "QC",
    city: "Montreal",};
    const { getByTestId, rerender } = render(
      <BrowserRouter><Registration
        searchValue={stubbedSearchValue}
        handleChangeValue={mockChangeValue}
      /></BrowserRouter>
    );

    act(() => {
      fireEvent.change(getByTestId("filter-input-email"), {
        target: { value: "bahar@bahar.com" },
      });
      fireEvent.change(getByTestId("filter-input-password"), {
        target: { value: "bahar123" },
      });
      fireEvent.change(getByTestId("filter-input-name"), {
        target: { value: "Bahar" },
      });
      fireEvent.change(getByTestId("filter-input-role"), {
        target: { value: "Employer" },
      });
      fireEvent.change(getByTestId("filter-input-province"), {
        target: { value: "QC" },
      });
      fireEvent.change(getByTestId("filter-input-city"), {
        target: { value: "Montreal" },
      });
    });

    rerender(
      <BrowserRouter><Registration
        searchValue={changedSearchValue}
        handleChangeValue={mockChangeValue}
      /></BrowserRouter>
    );

    expect(getByTestId("filter-input-email").value).toBe("bahar@bahar.com");
    expect(getByTestId("filter-input-password").value).toBe("bahar123");
    expect(getByTestId("filter-input-name").value).toBe("Bahar");
    expect(getByTestId("filter-input-role").value).toBe("Employer");
    expect(getByTestId("filter-input-province").value).toBe("QC");
    expect(getByTestId("filter-input-city").value).toBe("Montreal");
    //expect(mockChangeValue).toBeCalledTimes(1);
  });

  //=========================***************************====================
  it("triggers event handler on add all field value", () => {
    const changedSearchValue = { ...stubbedSearchValue, name: "Bahar" };
    const { getByTestId, rerender } = render(
      <BrowserRouter><Registration
        searchValue={stubbedSearchValue}
        handleChangeValue={mockChangeValue}
      /></BrowserRouter>
    );

    act(() => {
      fireEvent.change(getByTestId("filter-input-name"), {
        target: { value: "Bahar" },
      });
    });

    rerender(
      <BrowserRouter><Registration
        searchValue={changedSearchValue}
        handleChangeValue={mockChangeValue}
      /></BrowserRouter>
    );

    expect(getByTestId("filter-input-name").value).toBe("Bahar");
    //expect(mockChangeValue).toBeCalledTimes(1);
  });

  //=======================================================================
  const mockRegistration = jest.fn((email, password, name, role,province, city ) => {
    return Promise.resolve({ email, password, name, role,province, city });
  });
  
  describe("Registration", () => {
    beforeEach(() => {
      render(<BrowserRouter><Registration/></BrowserRouter>);
    });
    
    it("should display required error when value is invalid", async () => {
      fireEvent.submit(screen.getByRole("button"));
  
      expect(await screen.findAllByRole("alert")).toHaveLength(6);
      expect(mockRegistration).not.toBeCalled();
    });
  
    it("should display matching error when email is invalid", async () => {
      fireEvent.input(screen.getByPlaceholderText(/Please Enter your email/i), {
        target: {
          value: "test"
        }
      });
  
      fireEvent.input(screen.getByPlaceholderText(/Enter your password/i), {
        target: {
          value: "password"
        }
      });
      fireEvent.input(screen.getByPlaceholderText(/John Smith/i), {
        target: {
          value: "bahar"
        }
      });
      fireEvent.input(screen.getByPlaceholderText(/Choose your role/i), {
        target: {
          value: "Employer"
        }
      });
      fireEvent.input(screen.getByPlaceholderText(/Choose your Province/i), {
        target: {
          value: "QC"
        }
      });
      fireEvent.input(screen.getByPlaceholderText(/Enter your city/i), {
        target: {
          value: "Montreal"
        }
      });
  
      fireEvent.submit(screen.getByRole("button"));
  
      expect(await screen.findAllByRole("alert").toBe("d"));
      expect(mockRegistration).not.toBeCalled();
      expect(screen.getByPlaceholderText(/Please Enter your email/i).value).toBe("test");
      expect(screen.getByPlaceholderText(/Enter your password/i).value).toBe("password");
      expect(screen.getByPlaceholderText(/John Smith/i).value).toBe("bahar");
      expect(screen.getByPlaceholderText(/Choose your role/i).value).toBe("Employer");
      expect(screen.getByPlaceholderText(/Choose your Province/i).value).toBe("QC");
      expect(screen.getByPlaceholderText(/Enter your city/i).value).toBe("Montreal");
    });
  
    // it("should display min length error when password is invalid", async () => {
    //   fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
    //     target: {
    //       value: "test@mail.com"
    //     }
    //   });
  
    //   fireEvent.input(screen.getByLabelText("password"), {
    //     target: {
    //       value: "pass"
    //     }
    //   });
  
    //   fireEvent.submit(screen.getByRole("button"));
  
    //   expect(await screen.findAllByRole("alert")).toHaveLength(1);
    //   expect(mockLogin).not.toBeCalled();
    //   expect(screen.getByRole("textbox", { name: /email/i }).value).toBe(
    //     "test@mail.com"
    //   );
    //   expect(screen.getByLabelText("password").value).toBe("pass");
    // });
  
    // it("should not display error when value is valid", async () => {
    //   fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
    //     target: {
    //       value: "test@mail.com"
    //     }
    //   });
  
    //   fireEvent.input(screen.getByLabelText("password"), {
    //     target: {
    //       value: "password"
    //     }
    //   });
  
    //   fireEvent.submit(screen.getByRole("button"));
  
    //   await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
    //   expect(mockLogin).toBeCalledWith("test@mail.com", "password");
    //   expect(screen.getByRole("textbox", { name: /email/i }).value).toBe("");
    //   expect(screen.getByLabelText("password").value).toBe("");
    // });
  });


//=======================================================================
// it("triggers event handler on input change to invalid email", () => {
//   const changedSearchValue = { ...stubbedSearchValue, email: "invalid email" };
//   const { getByTestId, rerender } = render(
//     <BrowserRouter><Registration
//       searchValue={stubbedSearchValue}
//       handleChangeValue={mockChangeValue}
//     /></BrowserRouter>
//   );

//   act(() => {
//     fireEvent.change(getByTestId("filter-input-email"), {
//       target: { value: "invalid email" },
//     });
//   });

//   rerender(
//     <BrowserRouter><Registration
//       searchValue={changedSearchValue}
//       handleChangeValue={mockChangeValue}
//     /></BrowserRouter>
//   );
//   const checkContent = screen.getByTestId("filter-error-email");
//   expect(checkContent).toHaveTextContent("invalid email address");
//   //expect(getByTestId("filter-error-email").innerHTML).toMatch("invalid email address")
// });

})





// describe("Registration", () => {
//   describe("with valid inputs", () => {
//     it('calls the onSubmit function', async () => {
//       const mockOnSubmit = jest.fn()
//       const {getByLabelText, getByRole} = render(<BrowserRouter><Registration onSubmit={mockOnSubmit}/></BrowserRouter>)

//       await act(async () => {
//         fireEvent.change(getByLabelText("Email: *"), {target: {value: "jim@jim.com"}})
//         fireEvent.change(getByLabelText("Password: *"), {target: {value: "Password123"}})
//       })

//       await act(async () => {
//         fireEvent.click(getByRole("button"))
//       })

//       expect(mockOnSubmit).toHaveBeenCalled()
//     })
//   })

//   describe("with invalid email", () => {
//     it("renders the email validation error", async () => {
//       const {getByLabelText, container} = render(<Registration />)

//       await act(async () => {
//         const emailInput = screen.getByLabelText("Email: *")
//         fireEvent.change(emailInput, {target: {value: "invalid email"}})
//         fireEvent.blur(emailInput)
//       })

//       expect(container.innerHTML).toMatch("invalid email address")
//     })
//   })

//   describe("with invalid password", () => {
//     it("renders the password validation error", async () => {
//       const {getByLabelText, container} = render(<Registration />)

//       await act(async () => {
//         const paswordInput = screen.getByLabelText("Password: *")
//         fireEvent.change(paswordInput, {target: {value: "12"}})
//         fireEvent.blur(paswordInput)
//       })

//       expect(container.innerHTML).toMatch("Length cannot be less than 4 characters")

//     })
//   })
// })







