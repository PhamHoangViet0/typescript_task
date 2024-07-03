/**
 * Checks if url is valid
 * 
 * @param {string} url - url to check 
 * @returns {boolean} 
 */
function isValidUrl(url: string): boolean {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/i;
    return urlPattern.test(url);
}

/**
 * 
 * @param {string} url - url to check 
 * @returns An object indicating whether the resource exists and its type.
 *          - `exists`: Indicates whether the resource exists (boolean).
 *          - `type`: Specifies the type of the resource ('file' | 'folder' | 'none')
 */
async function mockServerCheck(url: string): Promise<{ exists: boolean; type: 'file' | 'folder' | 'none' }> {
    return new Promise((resolve) => {
        // Mock server response with delay (simple logic to check all outputs)
        setTimeout(() => {
            if (url.includes("file")) {
                resolve({ exists: true, type: 'file' });
            } else if (url.includes("folder")) {
                resolve({ exists: true, type: 'folder' });
            } else {
                resolve({ exists: false, type: 'none' });
            }
        }, 1000);
    });
}

/**
 * 
 * @param {string} url - url to check  
 * @param {HTMLDivElement} resultDiv - output element
 */
async function mockServerCheckOutput(url: string, resultDiv: HTMLDivElement) {
    
    resultDiv.textContent = 'Checking...';
    try {
        const response = await mockServerCheck(url);
        if (response.exists) {
            resultDiv.textContent = `${url} URL exists and it is a ${response.type}.`;
        } else {
            resultDiv.textContent = `${url} URL does not exist.`;
        }
    } catch (error) {
        console.log(error)
        resultDiv.textContent = 'Error checking URL.';
    }
}

/**
 * 
 * @param {Function} func wrapped function
 * @param {number} limit throttle time in ms
 * @returns wrapped function
 */
function throttle<T extends (...args: any[]) => void>(func: T, limit: number) {
    /** @type {boolean} indicates throttling*/
    let inThrottle: boolean = false;
    /** @type {boolean} indicates if function was called while throttling*/
    let inThrottleUpdate: boolean = false;

    // stores recent call arguments while throttling
    let lastArgs: any[];
    let lastThis: any | null = null;
  
    function wrapper(this: ThisParameterType<T>, ...args: Parameters<T>) {
      
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true
            setTimeout(() => {
                if (inThrottleUpdate) {
                    func.apply(lastThis, lastArgs);
                    inThrottleUpdate = false;
                    setTimeout(() => {inThrottle = false}, limit);
                } else {
                    inThrottle = false
                }
            }, limit);
        } else {
            inThrottleUpdate = true;
            lastArgs = args;
            lastThis = this;
        }
    }
  
    return wrapper as T;
}

// create throttled check
const throttledmockServerCheckOutput = throttle(mockServerCheckOutput, 3000);

/**
 * Event listener
 * 
 * @param {Event} event 
 * @returns 
 */
function checkUrl(event: Event) {
    const input = event.target as HTMLInputElement;
    // const input = document.getElementById('url-input') as HTMLInputElement;
    const resultDiv = document.getElementById('result') as HTMLDivElement;
    const url = input.value.trim();
    console.log(url)

    if (!isValidUrl(url)) {
        resultDiv.textContent = `${url} Invalid URL format.`;
        return;
    }
    
    throttledmockServerCheckOutput(url, resultDiv)
}

// add event listener to input
document.getElementById('url-input')!.addEventListener('input', checkUrl);