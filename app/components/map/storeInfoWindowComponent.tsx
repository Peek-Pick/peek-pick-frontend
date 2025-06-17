import { InfoWindow } from '@react-google-maps/api';

interface StoreInfoWindowProps {
    position: google.maps.LatLngLiteral;
    onClose: () => void;
    selectedStore: google.maps.places.PlaceResult;
    onRoute: (storePosition: google.maps.LatLngLiteral) => void;
}

const StoreInfoWindow: React.FC<StoreInfoWindowProps> = ({ position, onClose, selectedStore, onRoute }) => {
    if (!selectedStore) return null;

    return (
        <InfoWindow position={position} onCloseClick={onClose}>
            <div onClick={e => e.stopPropagation()} className="p-3 w-[175px] sm:w-[340px] bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-lg transition-all duration-300 text-xs sm:text-sm">
                {/* 가게명 */}
                <h4 className="text-sm sm:text-base font-bold mb-2 text-gray-800 break-words">
                    🏪 {selectedStore.name}
                </h4>

                {/* 사진 */}
                {selectedStore.photos && selectedStore.photos.length > 0 && (
                    <div className="flex overflow-x-auto gap-2 mb-2 scrollbar-hide">
                        {selectedStore.photos.slice(0, 3).map((photo, idx) => (
                            <img
                                key={idx}
                                src={photo.getUrl({ maxWidth: 100 })}
                                alt={`${selectedStore.name} photo ${idx + 1}`}
                                className="rounded-lg shadow w-[100px] h-[80px] object-cover flex-shrink-0"
                            />
                        ))}
                    </div>
                )}

                {/* 평점 */}
                <div className="flex items-center text-yellow-500 mb-2">
                    <span>⭐️</span>
                    <span className="ml-1 text-gray-800 font-semibold">{selectedStore.rating || 'N/A'} / 5.0</span>
                    {selectedStore.user_ratings_total && (
                        <span className="ml-1 text-[10px] text-gray-500">
                            ({selectedStore.user_ratings_total} reviews)
                        </span>
                    )}
                </div>

                {/* 주소 */}
                <p className="text-gray-700 mb-1 whitespace-normal break-words">
                    📍 {selectedStore.formatted_address || selectedStore.vicinity || 'No address available'}
                </p>

                {/* 전화번호 */}
                <p className="text-gray-700 mb-1 whitespace-normal break-words">
                    ☎️ {selectedStore.formatted_phone_number || 'No phone number available'}
                </p>

                {/* 오픈 시간 */}
                <div className="mt-3 text-gray-700">
                    <div className="font-semibold mb-1">🕒 Opening Hours</div>
                    <ul className="list-disc list-inside ml-1 space-y-1 max-h-32">
                        {selectedStore.opening_hours?.weekday_text?.map((text, i) => (
                            <li key={i} className="whitespace-normal break-words pr-2 text-[10px]">
                                {text}
                            </li>
                        )) || <li className="text-[10px]">N/A</li>}
                    </ul>
                </div>

                {/* 리뷰 */}
                {selectedStore.reviews && selectedStore.reviews.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 mt-4 shadow-sm max-h-60 overflow-auto w-full text-xs">
                        <div className="font-semibold text-gray-800 mb-2 text-xs">💬 Top Review</div>
                        <p className="text-xs text-gray-600 italic">
                            “{selectedStore.reviews[0].text.length > 150
                            ? selectedStore.reviews[0].text.slice(0, 150) + '...'
                            : selectedStore.reviews[0].text}”
                        </p>
                        <div className="text-[9px] text-gray-400 mt-1 text-right">
                            — {selectedStore.reviews[0].author_name}
                        </div>
                    </div>
                )}

                {/* 길찾기 버튼 */}
                <button
                    onClick={() => {
                        if (onRoute) {
                            onRoute(position); // 위치 전달
                        }

                    }}
                    className="mt-4 w-full bg-yellow-300/70 hover:bg-yellow-400 text-white font-semibold py-2 rounded-lg transition duration-300 text-center"
                >
                    🚶 Directions
                </button>
            </div>
        </InfoWindow>
    );
};

export default StoreInfoWindow;
