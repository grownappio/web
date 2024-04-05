import React, { useState, useEffect } from 'react'
import Form from 'rc-field-form'
import { setWalletToken } from '@/units/index'
import { encrypt } from '@/units/jsencrypt'
import delMaskCloseImg from '@/assets/img/profile/photoAlbum/del-mask-close.svg'
import { checkPassword, sessionStorageKey } from '../../service'
import Input from '@/components/Input'
import { useHistory } from 'react-router-dom'

interface ModalProps {
  onSuccess?: () => void
  history?: ReturnType<typeof useHistory>
  [key: string]: any
}

const VerifyPassword = (props: ModalProps) => {
  const [form] = Form.useForm()
  const [chain_id] = useState(Number(sessionStorage.getItem(sessionStorageKey[0])))

  // todo
  // const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   const keyCode = event.keyCode || event.which || event.charCode;
  //   if (keyCode === 13) {
  //     startCheck();
  //   }
  // }

  // todo
  function aaa() {
    // <ForgotPassword title="Restore your wallet account" />
    props.history?.push('/restoreWalletAccount')
  }

  const validatorPsw = async (_: any, psw: string) => {
    try {
      const { data } = await checkPassword({ chain_id, password: encrypt(psw) })
      setWalletToken(data.wallet_token)
    } catch (e) {
      throw 'Incorrect password'
    }
  }

  function onSuccess() {
    props.onSuccess?.()
  }

  return (
    <div className='px-24 text-center'>
      <div className='mt-32 mb-24 text-18 font-[600]'>Access your wallet account</div>
      <div className='mt-24 mb-32 text-16 opacity-60'>Enter your wallet password</div>
      <Form form={form} initialValues={{ psw: '' }} onFinish={onSuccess}>
        <Input className='mb-40' name='psw' placeholder='Enter password' type='password' trigger={[]} rules={[{ validator: validatorPsw }]} />
      </Form>
      <button className='btn-primary mb-24 py-14 w-full text-16 font-[600]' onClick={() => form.submit()}>Confirm</button>
      <div className='mb-38 font-medium underline opacity-30' onClick={aaa}>Forgot password</div>
    </div>
  )
}

export default VerifyPassword
