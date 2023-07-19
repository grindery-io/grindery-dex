import React from 'react';
import { Box } from '@mui/system';
import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { getOrderHistory } from '../../utils';
import { OrderPlacingModalV2Props } from './OrderPlacingModalV2';

const OrderPlacingModalV2History = (props: OrderPlacingModalV2Props) => {
  const { orderStatus, createdOrder, chains, offer } = props;

  const steps = getOrderHistory(chains, createdOrder, offer);

  const activeStepIndex = steps.findIndex(
    (step) =>
      step &&
      (createdOrder?.status
        ? step.status === createdOrder?.status
        : step.status === orderStatus)
  );

  const activeStep = activeStepIndex > -1 ? activeStepIndex : 0;

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.04)',
        borderRadius: '20px',
        padding: '40px',
      }}
    >
      <Typography variant="h2" sx={{ margin: '0 0 40px', padding: 0 }}>
        Order History
      </Typography>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          '& .MuiStep-root .MuiStepContent-root': {
            borderColor: '#DCDCDC',
          },
          '& .MuiStep-root.Mui-completed .MuiStepContent-root': {
            borderColor: '#F57F21',
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: '#F57F21',
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: '#F57F21',
          },
          '& .MuiStepConnector-root.Mui-disabled .MuiStepConnector-line': {
            borderColor: '#DCDCDC',
          },
          '& .MuiStepLabel-iconContainer': {
            paddingRight: '6.5px',
          },
          '& .MuiStepLabel-label.Mui-disabled': {
            color: '#979797',
          },
        }}
      >
        {steps.map((step, index) => (
          <Step
            key={step.title}
            expanded={true}
            last={index === steps.length - 1}
          >
            <StepLabel
              StepIconComponent={({ className }) => (
                <Box className={className}>
                  {index === activeStep ? (
                    <Box
                      sx={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#F57F21',
                        margin: '0 4.5px',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          left: '50%',
                          top: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                        }}
                      />
                    </Box>
                  ) : (
                    <>
                      {index > activeStep ? (
                        <Box
                          sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#DCDCDC',
                            margin: '0 8.5px',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#F57F21',
                            margin: '0 8.5px',
                          }}
                        />
                      )}
                    </>
                  )}
                </Box>
              )}
              sx={{
                paddingTop: '4px',
                paddingBottom: '4px',
                '& .MuiStepLabel-label': {
                  fontWeight: '700',
                  fontSize: '16px',
                  lineHeight: '19px',
                },
              }}
            >
              <span
                style={{
                  color: index === activeStep ? '#F57F21' : 'inherit',
                }}
              >
                {index < activeStep
                  ? step.completed?.title || step.title
                  : step.title}
              </span>
              {step.subtitle ||
                (index < activeStep && step.completed?.subtitle && (
                  <span
                    style={{
                      fontWeight: '400',
                      color: '#979797',
                      fontSize: '12px',
                    }}
                  >
                    {' '}
                    •{' '}
                    {index < activeStep
                      ? step.completed?.subtitle || step.subtitle
                      : step.subtitle}
                  </span>
                ))}
            </StepLabel>
            <StepContent
              sx={{
                color: index <= activeStep ? '#0B0D17' : '#979797',
                '& .MuiTypography-body1': {
                  fontWeight: '400',
                  fontSize: '14px',
                  lineHeight: '125%',
                  color: 'inherit',
                },
                '& .MuiIconButton-root svg': {
                  color: '#F57F21',
                },
              }}
            >
              {index < activeStep
                ? step.completed?.content || step.content
                : step.content}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OrderPlacingModalV2History;
