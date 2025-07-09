// import React from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store';
// import { useAppDispatch } from '../hooks/useAppDispatch';
// import { undo, redo } from '../store/slices/historySlice';
// import { clearImage } from '../store/slices/imageSlice';
// import { Download, Undo, Redo, Trash2 } from 'lucide-react';

// const ActionBar: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { canUndo, canRedo } = useSelector((state: RootState) => state.history);
//   const { transformedUrl, publicId } = useSelector((state: RootState) => state.image);

//   const handleDownload = () => {
//     if (transformedUrl) {
//       const link = document.createElement('a');
//       link.href = transformedUrl;
//       link.download = `edited-image-${Date.now()}.jpg`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handleClear = () => {
//     if (window.confirm('Are you sure you want to clear the current image? All changes will be lost.')) {
//       dispatch(clearImage());
//     }
//   };

//   return (
//     <div className="flex items-center justify-between p-2.5 bg-slate-800 border-b border-gray-600">
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={() => dispatch(undo())}
//           disabled={!canUndo}
//           className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
//             canUndo
//               ? 'bg-slate-700 text-gray-700 hover:bg-gray-200'
//               : 'bg-slate-900 text-gray-400 cursor-not-allowed'
//           }`}
//         >
//           <Undo className="w-4 h-4 mr-2" />
//           {/* Undo */}
//         </button>

//         <button
//           onClick={() => dispatch(redo())}
//           disabled={!canRedo}
//           className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
//             canRedo
//               ? 'bg-slate-700 text-gray-700 hover:bg-gray-200'
//               : 'bg-slate-900 text-gray-400 cursor-not-allowed'
//           }`}
//         >
//           <Redo className="w-4 h-4 mr-2" />
//           {/* Redo */}
//         </button>
//       </div>

//       <div className="flex items-center space-x-2">
//         <button
//           onClick={handleClear}
//           disabled={!publicId}
//           className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
//             publicId
//               ? 'bg-red-100 text-red-700 hover:bg-red-200'
//               : 'bg-gray-50 text-gray-400 cursor-not-allowed'
//           }`}
//         >
//           <Trash2 className="w-4 h-4 mr-2" />
//           Clear
//         </button>

//         <button
//           onClick={handleDownload}
//           disabled={!transformedUrl}
//           className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
//             transformedUrl
//               ? 'bg-blue-500 text-white hover:bg-blue-600'
//               : 'bg-gray-50 text-gray-400 cursor-not-allowed'
//           }`}
//         >
//           <Download className="w-4 h-4 mr-2" />
//           Download
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ActionBar;