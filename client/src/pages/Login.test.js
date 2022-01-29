import React from 'react'
import Login from './Login'
import { render, fireEvent, wait } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { BrowserRouter } from 'react-router-dom'

// describe("Login", () => {
//   describe("with valid inputs", () => {
//     it('calls the onSubmit function', async () => {
//       const mockOnSubmit = jest.fn()
//       const {container, getByRole} = render(<BrowserRouter><Login onSubmit={mockOnSubmit}/></BrowserRouter>)
//       const email = container.querySelector('input[name="email"]')
//       const password = container.querySelector('input[name="password"]')
//       await act(async () => {
//         fireEvent.change(email, {target: {value: "email@test.com"}})
//         fireEvent.change(password, {target: {value: "1234567"}})
//       })

//       await act(async () => {
//         fireEvent.click(getByRole("button"))
//       })

//       expect(mockOnSubmit).toHaveBeenCalled()
//     })
//   })
// ********************************************
//   describe("with invalid email", () => {
//     it("renders the email validation error", async () => {
//       const {getByLabelText, container} = render(<BrowserRouter><Login/></BrowserRouter>)

//       await act(async () => {
//         const emailInput = getByLabelText("Email:")
//         fireEvent.change(emailInput, {target: {value: "invalid email"}})
//         fireEvent.blur(emailInput)
//       })

//       expect(container.innerHTML).toMatch("Enter a valid email")
//     })
//   })

//   describe("with invalid password", () => {
//     it("renders the password validation error", async () => {
//       const {getByLabelText, container} = render(<BrowserRouter><Login/></BrowserRouter>)

//       await act(async () => {
//         const paswordInput = getByLabelText("Password: *")
//         fireEvent.change(paswordInput, {target: {value: "123"}})
//         fireEvent.blur(paswordInput)
//       })

//       expect(container.innerHTML).toMatch("Password should be longer than 6 characters")

//     })
 // })
//})


// import React from 'react'
// import { render,screen, fireEvent } from "@testing-library/react"
// import Login from "./Login"
// import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
// import { act } from 'react-dom/test-utils'


// test('on initial render,login button is disabled', ()=>{
//     render(<BrowserRouter><Login/></BrowserRouter>);
//     screen.debug();
// })


// describe("Login", () => {
//   describe("with valid inputs", () => {
//     it('calls the onSubmit function', async () => {
//       const mockOnSubmit = jest.fn()
//       const {getByLabelText, getByRole} = render(<Login onSubmit={mockOnSubmit}/>)

//       await act(async () => {
//         fireEvent.change(getByLabelText("Email: *"), {target: {value: "jim@jim.com"}})
//         fireEvent.change(getByLabelText("Password *"), {target: {value: "Password123"}})
//       })

//       await act(async () => {
//         fireEvent.click(getByRole("button"))
//       })

//       expect(mockOnSubmit).toHaveBeenCalled()
//     })
//   })

//   describe("with invalid email", () => {
//     it("renders the email validation error", async () => {
//       const {getByLabelText, container} = render(<Login />)

//       await act(async () => {
//         const emailInput = getByLabelText("Email: *")
//         fireEvent.change(emailInput, {target: {value: "invalid email"}})
//         fireEvent.blur(emailInput)
//       })

//       expect(container.innerHTML).toMatch("Enter a valid email")
//     })
//   })

//   describe("with invalid password", () => {
//     it("renders the password validation error", async () => {
//       const {getByLabelText, container} = render(<Login />)

//       await act(async () => {
//         const paswordInput = getByLabelText("Password: *")
//         fireEvent.change(paswordInput, {target: {value: "12"}})
//         fireEvent.blur(paswordInput)
//       })

//       expect(container.innerHTML).toMatch("password must be at least 4 characters")

//     })
//   })
// })

describe("with valid inputs", () => {
it("submits correct values", async () => {
    const { container } = render(<BrowserRouter><Login/></BrowserRouter>)
    const passsword = container.querySelector('input[name="password"]')
    const email = container.querySelector('input[name="email"]')

  
    await wait(() => {
      fireEvent.change(email, {
        target: {
          value: "jim@jim.com"
        }
      })
    })
  
    await wait(() => {
      fireEvent.change(passsword, {
        target: {
          value: "Password123"
        }
      })
    })
  
    expect(results.innerHTML).toBe(
      '{"email":"jim@jim.com","password":"password123"}'
    )
  })
})
