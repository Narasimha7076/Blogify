// import React from "react";

// function Logo({width = '100px'}){
//     return (
//         <div>Logo</div>
//     )
// }

// export default Logo;
import React from "react";

function Logo({ width = '100px' }) {
    return (
        <div className={`flex items-center justify-center w-${width}`}>
            <svg
                className="text-black-400"
                width="10%"
                height="10%"
                viewBox="0 0 64 64"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="32" cy="32" r="32" fill="currentColor" />
                <text
                    x="32"
                    y="37"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontSize="24"
                    fill="white"
                >
                    B
                </text>
            </svg>
            <span className="ml-2 text-2xl font-bold text-black-400">Blog</span>
        </div>
    );
}

export default Logo;
