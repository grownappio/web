import JSEncrypt from "jsencrypt";
import { Buffer } from "buffer";

const base64Str = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFuYXc4Nld4bVlKZzJFOStpMDFWeAo5WGt6YlppZk44dUJBUDRaaHovRENkam4zUGVIcEEySUYyUHlwK3RCUnU2Wjc5Mk5mWmZVNlJPU01LVEZVTFBoCkk5UU9Ja0F5ZXpTL1NxNE40SE1DODg3UEQwS3FVSnRmTGVmTjJnblN6OWdTZFdCVXpndmFKdjBZUy9KZ2UrWTgKMERSRXEzSUpSUVJuNVd3U1N2Q1BjdHB2M0NtR0JWTDhGck9scHg1R29DRXVYNHVhMVAvUHNCQ2VWRDdzeCtLKwpQTldRcENRczVjdWE0Nkx0dkZVT3dYU05LOFRydzZqMmVUN3d4VVk5dGpBMUtDellTRGZHS2NmMTlCMzg1bnpyCk53K1BrWW02SEZYQkt6Z2NtNFZMZWV6L0hXY0k3MHhXWmozWmVZTnk4NVB2MXBXQmJuYzR6VnlxMU1MSWpLQnEKL3dJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=='
const desStr = Buffer.from(base64Str, 'base64').toString();

export const encrypt = (str: string) => {
  let encryptor = new JSEncrypt() // 新建JSEncrypt对象
  encryptor.setPublicKey(desStr) // 设置publickey
  const tempStr = encryptor.encrypt(str) || ''
  return tempStr;
}