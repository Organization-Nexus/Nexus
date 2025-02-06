// import { userValidation } from "@/utils/validators/userValidation";
// import { useState } from "react";

// const PasswordChangeForm = ({ onClose }: { onClose: () => void }) => {
//     const [passwordForm, setPasswordForm] = useState({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//     const [message, setMessage] = useState<MessageType>({ type: "", text: "" });
//     const [isLoading, setIsLoading] = useState(false);

//     const handlePasswordChange = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setIsLoading(true);

//       try {
//         // 유효성 검사
//         const currentPasswordError = userValidation.password(passwordForm.currentPassword);
//         if (currentPasswordError) {
//           setMessage({ type: "error", text: "현재 비밀번호를 입력해주세요." });
//           return;
//         }

//         const newPasswordError = userValidation.password(passwordForm.newPassword);
//         if (newPasswordError) {
//           setMessage({ type: "error", text: newPasswordError });
//           return;
//         }

//         const confirmError = userValidation.passwordConfirm(
//           passwordForm.newPassword,
//           passwordForm.confirmPassword
//         );
//         if (confirmError) {
//           setMessage({ type: "error", text: confirmError });
//           return;
//         }

//         // API 호출
//         await userApi.changePassword({
//           currentPassword: passwordForm.currentPassword,
//           newPassword: passwordForm.newPassword,
//         });

//         setMessage({ type: "success", text: "비밀번호가 성공적으로 변경되었습니다." });
//         setTimeout(() => {
//           onClose();
//         }, 1500);

//       } catch (error: any) {
//         setMessage({
//           type: "error",
//           text: error.response?.data?.message || "비밀번호 변경에 실패했습니다."
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     return (
//       <div className="space-y-4">
//         {message.text && (
//           <div className={`p-3 rounded-lg text-sm ${
//             message.type === "error"
//               ? "bg-red-50 text-red-500"
//               : "bg-green-50 text-green-500"
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handlePasswordChange} className="space-y-4">
//           <div className="grid grid-cols-6">
//             <div className="self-center">
//               <label className="text-sm font-bold text-gray-700">현재 비밀번호</label>
//             </div>
//             <div className="col-span-5">
//               <UnderlineInput
//                 type="password"
//                 name="currentPassword"
//                 value={passwordForm.currentPassword}
//                 onChange={(e) => setPasswordForm(prev => ({
//                   ...prev,
//                   currentPassword: e.target.value
//                 }))}
//                 placeholder="현재 비밀번호를 입력해주세요"
//                 className="p-0"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-6">
//             <div className="self-center">
//               <label className="text-sm font-bold text-gray-700">새 비밀번호</label>
//             </div>
//             <div className="col-span-5">
//               <UnderlineInput
//                 type="password"
//                 name="newPassword"
//                 value={passwordForm.newPassword}
//                 onChange={(e) => setPasswordForm(prev => ({
//                   ...prev,
//                   newPassword: e.target.value
//                 }))}
//                 placeholder="새 비밀번호를 입력해주세요"
//                 className="p-0"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-6">
//             <div className="self-center">
//               <label className="text-sm font-bold text-gray-700">비밀번호 확인</label>
//             </div>
//             <div className="col-span-5">
//               <UnderlineInput
//                 type="password"
//                 name="confirmPassword"
//                 value={passwordForm.confirmPassword}
//                 onChange={(e) => setPasswordForm(prev => ({
//                   ...prev,
//                   confirmPassword: e.target.value
//                 }))}
//                 placeholder="비밀번호를 다시 입력해주세요"
//                 className="p-0"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-2">
//             <Modal.Button
//               type="button"
//               variant="secondary"
//               onClick={onClose}
//               className="text-sm"
//             >
//               취소
//             </Modal.Button>
//             <Modal.Button
//               type="submit"
//               disabled={isLoading}
//               className="text-sm"
//             >
//               {isLoading ? "변경 중..." : "확인"}
//             </Modal.Button>
//           </div>
//         </form>
//       </div>
//     );
//   };
