/**
 * Utility functions for checking connection status
 */

/**
 * Checks if a connection to a specific host and port is available
 * 
 * Note: In a browser environment, direct TCP connection checks are not possible.
 * This function uses fetch with a timeout to check if a server responds.
 * 
 * @param host - The hostname or IP address to check
 * @param port - The port number to check
 * @param timeout - Timeout in milliseconds (default: 5000ms)
 * @returns Promise<boolean> - True if connection is successful, false otherwise
 */
export const checkConnection = async (
    host: string,
    port: string,
    timeout: number = 5000
  ): Promise<boolean> => {
    try {
      // Create a controller to abort the fetch request after timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // We'll use a HEAD request to check if the server is responding
      // Note: In a real-world scenario, you might need to use a specific API endpoint
      // that your backend provides for health checks
      const url = `http://${host}:${port}/`;
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        // No-cors mode to avoid CORS issues, but this will limit response information
        mode: 'no-cors'
      });
      
      clearTimeout(timeoutId);
      
      // If we get here, the connection was successful
      return true;
    } catch (error) {
      console.error(`Connection failed to ${host}:${port}:`, error);
      return false;
    }
  };
  
  /**
   * A more robust connection check that can be used for different protocols
   * In a real application, you would implement specific checks for different services
   */
  export const checkServiceStatus = async (
    serviceType: 'http' | 'https' | 'api',
    host: string,
    port: string,
    endpoint: string = '/',
    timeout: number = 5000
  ): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const protocol = serviceType === 'https' ? 'https' : 'http';
      const url = `${protocol}://${host}:${port}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.error(`Service check failed for ${serviceType} at ${host}:${port}:`, error);
      return false;
    }
  };