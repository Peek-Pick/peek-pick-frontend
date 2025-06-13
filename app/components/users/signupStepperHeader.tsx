interface Step {
    label: string
    step: number
    icon: string
}

interface StepperProps {
    currentStep: number
}

// 스텝 정보 배열 (라벨, 단계, 아이콘)
const steps: Step[] = [
    { label: 'Account', step: 1, icon: '📝' },
    { label: 'Profile', step: 2, icon: '👤' },
    { label: 'Tags', step: 3, icon: '🏷️' },
]

export const SignupStepperHeader: React.FC<StepperProps> = ({ currentStep }) => {
    const totalSteps = steps.length

    // 현재 스텝 기준 진행 바 너비 계산
    const width = `${(100 / (totalSteps - 1)) * (currentStep - 1)}%`

    return (
        <div className="mx-auto w-full max-w-2xl px-4 pb-10 mb-10">
            {/* 상단 인사 문구 */}
            <div className="flex flex-col text-center justify-center items-center mt-12 sm:mt-20 sm:mb-6">
                <h1 className="text-4xl text-white font-bold">Welcome!</h1>
                <p className="text-white mt-2 mb-6 text-md max-w-lg">
                    Join us and get started!
                </p>
            </div>

            {/* 스텝 진행 바 */}
            <div className="before:transform-y-1/2 relative flex justify-between before:absolute before:top-1/2 before:left-0 before:h-1 before:w-full before:bg-slate-200">
                {steps.map(({ step, label, icon }) => {
                    const isCompleted = currentStep > step // 완료된 스텝
                    const isCurrentOrPast = currentStep >= step // 현재 또는 완료된 스텝

                    return (
                        <div className="relative z-10" key={step}>
                            {/* 스텝 동그라미 */}
                            <div
                                className={`flex size-12 items-center justify-center rounded-full border-2 transition-all delay-200 ease-in
                                    ${isCompleted ? 'bg-slate-300 border-slate-300' : 'bg-white border-zinc-200'}
                                    ${!isCompleted && isCurrentOrPast ? 'border-slate-300' : ''}`}
                            >
                                {/* 완료된 스텝은 체크 표시 (임시로 L 사용, 흰색으로) */}
                                {isCompleted ? (
                                    <div className="-scale-x-100 rotate-45 text-lg font-semibold text-white">L</div>
                                ) : (
                                    // 진행 중이거나 대기 중이면 이모지 표시
                                    <span className="text-xl">{icon}</span>
                                )}
                            </div>

                            {/* 스텝 라벨 */}
                            <div className="absolute top-18 left-1/2 -translate-x-2/4 -translate-y-2/4">
                                <span className="text-md text-white">{label}</span>
                            </div>
                        </div>
                    )
                })}

                {/* 실제 진행 바 (회색, 좌측에서 너비만큼 늘어남) */}
                <div
                    className="transform-y-1/2 absolute top-1/2 left-0 h-1 bg-slate-300 transition-all delay-200 ease-in"
                    style={{ width }}
                ></div>
            </div>
        </div>
    )
}
