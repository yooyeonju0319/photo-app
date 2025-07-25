import React, { useState } from 'react';
import { Camera, Eye, EyeOff, User, Lock, HelpCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { createUser, validateUserCredentials, findUserByUsername, recoverUserAccount } from '../utils/database';
import { setCurrentUser } from '../utils/storage';

interface AuthScreenProps {
  onLogin: (user: UserType) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryQuestion, setRecoveryQuestion] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    question: '',
    answer: '',
    recoveryAnswer: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (showRecovery) {
        // Password recovery
        const user = await recoverUserAccount(formData.username, formData.recoveryAnswer);
        if (user) {
          setCurrentUser(user);
          onLogin(user);
        } else {
          setError('답변이 올바르지 않습니다.');
        }
      } else if (isSignUp) {
        // Sign up
        const existingUser = await findUserByUsername(formData.username);
        if (existingUser) {
          setError('이미 존재하는 아이디입니다.');
          return;
        }

        const newUser = await createUser({
          username: formData.username,
          password: formData.password,
          question: formData.question,
          answer: formData.answer
        });

        if (newUser) {
          setCurrentUser(newUser);
          onLogin(newUser);
        } else {
          setError('회원가입 중 오류가 발생했습니다.');
        }
      } else {
        // Login
        const user = await validateUserCredentials(formData.username, formData.password);
        if (user) {
          setCurrentUser(user);
          onLogin(user);
        } else {
          const existingUser = await findUserByUsername(formData.username);
          if (existingUser) {
            setRecoveryQuestion(existingUser.question);
            setShowRecovery(true);
            setError('비밀번호가 틀렸습니다. 보안 질문으로 계정을 복구하세요.');
          } else {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const securityQuestions = [
    '가장 좋아하는 색깔은?',
    '첫 번째 반려동물의 이름은?',
    '태어난 도시는?',
    '어머니의 성함은?',
    '가장 좋아하는 음식은?'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Lechabo
              </h1>
              <p className="text-gray-600 mt-2">
                {showRecovery ? '계정 복구' : isSignUp ? '새 계정 만들기' : '사진을 공유해보세요'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="아이디"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
                disabled={showRecovery}
              />
            </div>

            {/* Recovery Question */}
            {showRecovery && (
              <>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">보안 질문:</p>
                  <p className="text-blue-600">{recoveryQuestion}</p>
                </div>
                <div className="relative">
                  <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="recoveryAnswer"
                    placeholder="답변을 입력하세요"
                    value={formData.recoveryAnswer}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </>
            )}

            {/* Password (not shown in recovery mode) */}
            {!showRecovery && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Sign up fields */}
            {isSignUp && !showRecovery && (
              <>
                <select
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">보안 질문을 선택하세요</option>
                  {securityQuestions.map((q, index) => (
                    <option key={index} value={q}>{q}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="answer"
                  placeholder="보안 질문 답변"
                  value={formData.answer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  처리 중...
                </div>
              ) : (
                showRecovery ? '계정 복구' : isSignUp ? '회원가입' : '로그인'
              )}
            </button>
          </form>

          {/* Toggle buttons */}
          <div className="space-y-2 text-center">
            {!showRecovery && (
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-200"
              >
                {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
              </button>
            )}
            {showRecovery && (
              <button
                onClick={() => {
                  setShowRecovery(false);
                  setError('');
                  setFormData({ ...formData, recoveryAnswer: '' });
                }}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-200"
              >
                로그인으로 돌아가기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;