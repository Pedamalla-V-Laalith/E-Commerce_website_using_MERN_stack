import {Stepper, Step, StepLabel, Typography } from "@mui/material"
import "./CheckoutSteps.css"
import { AccountBalance, LibraryAddCheck, LocalShipping } from "@mui/icons-material"



function CheckoutSteps({activeStep})
{
    const steps = [
        {
            label : <Typography>Shipping Details</Typography>,
            icon : <LocalShipping/>
        },
        {
            label : <Typography>Confirm Order</Typography>,
            icon : <LibraryAddCheck/>
        },
        {
            label : <Typography>Payment</Typography>,
            icon : <AccountBalance/>
        },
    ]
    const stepStyles = {
        boxSizing : "border-box"
    }
    return (
        <>
        <Stepper alternativeLabel activeStep={activeStep} style = {stepStyles}>
            {steps.map((step,index)=>{
                return (
                    <Step key={index}>
                        <StepLabel 
                         
                        icon = {step.icon}
                        style={{
                            color : activeStep >= index ? "tomato" : "rgba(0,0,0,0.649)"
                        }}
                        >{step.label}</StepLabel>
                    </Step>
                )
            })}
        </Stepper>
        </>
    )
}



export default CheckoutSteps