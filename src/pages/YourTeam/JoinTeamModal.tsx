import React, { useState } from 'react';
import { X } from 'lucide-react';

interface JoinTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (code: string) => void;
}

export const JoinTeamModal: React.FC<JoinTeamModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [code, setCode] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            onSubmit(code.trim());
            setCode('');
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Tham gia nhóm bằng mã</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <label htmlFor="team-code" className="block text-sm font-medium text-gray-700 mb-2">
                            Mã nhóm
                        </label>
                        <input
                            id="team-code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Nhập mã nhóm"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            autoFocus
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Yêu cầu giáo viên hoặc quản trị viên cung cấp mã nhóm
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!code.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Tham gia
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
