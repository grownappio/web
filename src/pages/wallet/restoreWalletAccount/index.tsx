import React, { useState }  from 'react'
import { useHistory } from 'react-router-dom'
import { useCountDown } from 'ahooks'
import Form from 'rc-field-form'
import Appbar from '@/components/Appbar'
import Input from '@/components/Input'
import { checkEmail, checkEmailCode, forgotPassword, sendEmailCode } from '../components/ForgotPassword/service'
import { sessionStorageKey } from '../service'
import { PrettyConfirmApi } from '@/components/_utils/prettyConfirm'
import { encrypt } from '@/units/jsencrypt'

type Props = Partial<{
  history: ReturnType<typeof useHistory>
  onSuccess(): void
}>

const EmailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const PswReg = /^(?=.*[0-9])(?=.*[a-zA-Z]).+$/

const RestoreWalletAccount = (props: Props) => {
  const h = useHistory(), history = props.history || h
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()

  const [time, setTime] = useState<number>()
  const [_countdown] = useCountDown({ targetDate: time, onEnd: () => setTime(undefined) })
  const countdown = Math.round(_countdown / 1000)

  const [step, setStep] = useState(1)

  const chain_id = Number(sessionStorage.getItem(sessionStorageKey[0]));

  async function sendCode(email: string) {
    if (countdown) return
    // await sendEmailCode({ email })
    setTime(Math.floor(+new Date / 1000) * 1000 + 60000)
  }

  async function onConfirm() {
    if (step === 1) {
      form1.submit()
    } else {
      form2.submit()
    }
  }

  async function onFinish() {
    // setStep(3)
    await PrettyConfirmApi({
      title: 'Confirm password?',
      desc: 'The password is very important to protect assets, please ensure that it is properly kept and memorized before submitting.',
      request: () => forgotPassword({ chain_id, ...form1.getFieldsValue(), password: encrypt(form2.getFieldValue('password')) }),
      requestingText: 'Wallet created successfully',
      successText: 'Grown is restoring wallet account for you.',
      failText: 'System error, please try again later.'
    })
    history.goBack()
  }

  return (
    <div>
      <Appbar className='b-b-1' title='Restore your wallet account' />

      <div className='p-24 [&_.input]:text-16 [&_.label]:font-medium'>
        <div className='mb-36 text-16 text-center opacity-60'>
          { step === 1 ? 'Step1/2: Verify your email' : 'Step2/2: Reset password' }
        </div>

        <Form className={`${step !== 1 && 'hidden'}`} form={form1} initialValues={{ email: '', code: '' }} onFinish={() => setStep(2)}>
          <Input
            className='mb-46'
            name='email'
            label='Email'
            placeholder='Enter you email'
            trigger='onBlur'
            rules={[{
              async validator(_, v) {
                if (!EmailReg.test(v)) throw 'Incorrect email format'
                // await checkEmailCode({ chain_id, email: v, code })
                try {
                  await checkEmail({ email: v })
                } catch (e) {
                  throw 'Email does not match'
                }
              }
            }]}
          />

          <Input
            className='mb-40'
            name='code'
            label='Verification code'
            placeholder='Email verification code'
            trigger={[]}
            rules={[{
              async validator(_l, v) {
                try {
                  await checkEmailCode({ chain_id, ...form1.getFieldsValue() })
                } catch (e) {
                  throw ''
                }
              }
            }]}
            right={v => <span className='text-16 text-primary font-[500]' onClick={() => sendCode(v)}>{time ? countdown : 'Send Code'}</span>}
          />
        </Form>

        <Form className={`${step !== 2 && 'hidden'}`} form={form2} initialValues={{ password: '', password1: '' }} onFinish={onFinish}>
          <Input
            className='mb-46'
            name='password'
            label='Set a new wallet password'
            placeholder='Enter password'
            type='password'
            trigger='onBlur'
            rules={[{
              async validator(_, v) {
                if (!v || v?.length < 6) throw 'The password must be at least 6 characters long.'
                if (!PswReg.test(v)) throw 'Password contains at least Letters and numbers.'
              }
            }]}
          />

          <Input
            className='mb-40'
            name='password1'
            label='Confirm your password'
            placeholder='Confirm your password'
            type='password'
            trigger={'onBlur'}
            rules={[{
              async validator(_l, v) {
                if (v !== form2.getFieldValue('password')) throw 'The passwords entered twice are inconsistent'
              }
            }]}
          />
        </Form>

        <button className='btn-primary py-14 w-full text-16 font-semibold' onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  )
}

export default RestoreWalletAccount