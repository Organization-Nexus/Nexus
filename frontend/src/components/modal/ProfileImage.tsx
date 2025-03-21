// import { useState } from "react";
// import { Modal } from "./config/ModalMaps";
// import { ModalRootProps } from "@/types/modal";
// import Image from "next/image";
// import { IdCard, LogOut, UserRound } from "lucide-react";
// import { Button } from "../ui/button";
// import LogoutModal from "./LogoutModal";
// import MyPageModal from "./Mypage";

// interface ProfileImageProps extends ModalRootProps {
//   user: {
//     name: string;
//     log: {
//       profileImage: string;
//     };
//   };
// }

// export default function ProfileImage({
//   isOpen,
//   onClose,
//   user,
// }: ProfileImageProps) {
//   const [isMyPageOpen, setIsMyPageOpen] = useState(false);
//   const [isLogoutOpen, setIsLogoutOpen] = useState(false);

//   return (
//     <>
//       <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//         hasOverlay={false}
//         className="absolute px-4 py-4 top-16 right-4 flex-col items-center justify-center w-[150px]"
//       >
//         <div className="grid grid-cols-3 place-items-center mb-4">
//           <div className="rounded-2xl">
//             <Image
//               src={user.log.profileImage}
//               alt="Profile Image"
//               width={40}
//               height={40}
//               className="object-cover rounded-2xl"
//               priority
//             />
//           </div>
//           <div className="col-span-2">
//             <Modal.Title className="text-xl font-bold mb-0">
//               {user.name}
//             </Modal.Title>
//           </div>
//         </div>

//         <Button variant="nothing" className="h-7 hover:font-semibold">
//           <UserRound />내 프로필
//         </Button>
//         <Button
//           onClick={() => setIsMyPageOpen(true)}
//           variant="nothing"
//           className="h-7 hover:font-semibold"
//         >
//           <IdCard />
//           마이페이지
//         </Button>
//         <Button
//           onClick={() => setIsLogoutOpen(true)}
//           variant="nothing"
//           className="h-7 hover:font-semibold"
//         >
//           <LogOut />
//           로그아웃
//         </Button>
//       </Modal>

//       <MyPageModal
//         isOpen={isMyPageOpen}
//         onClose={() => setIsMyPageOpen(false)}
//       />
//       <LogoutModal
//         isOpen={isLogoutOpen}
//         onClose={() => setIsLogoutOpen(false)}
//       />
//     </>
//   );
// }
