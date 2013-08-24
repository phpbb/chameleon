<?php
/**
*
* @package auth
* @copyright (c) 2013 phpBB Group
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2
*
*/

/**
* @ignore
*/
if (!defined('IN_PHPBB'))
{
	exit;
}


use OAuth\OAuth1\Token\StdOAuth1Token;
use OAuth\Common\Token\TokenInterface;
use OAuth\Common\Storage\TokenStorageInterface;
use OAuth\Common\Storage\Exception\StorageException;
use OAuth\Common\Storage\Exception\TokenNotFoundException;

/**
* OAuth storage wrapper for phpbb's cache
*
* @package auth
*/
class phpbb_auth_provider_oauth_token_storage implements TokenStorageInterface
{
	/**
	* Cache driver.
	*
	* @var phpbb_db_driver
	*/
	protected $db;

	/**
	* phpBB user
	*
	* @var phpbb_user
	*/
	protected $user;

	/**
	* Name of the OAuth provider
	*
	* @var string
	*/
	protected $service_name;

	/**
	* OAuth token table
	*
	* @var string
	*/
	protected $auth_provider_oauth_table;

	/**
	* @var object|TokenInterface
	*/
	protected $cachedToken;

	/**
	* Creates token storage for phpBB.
	*
	* @param	phpbb_db_driver	$db
	* @param	phpbb_user		$user
	* @param	string			$service_name
	* @param	string			$auth_provider_oauth_table
	*/
	public function __construct(phpbb_db_driver $db, phpbb_user $user, $service_name, $auth_provider_oauth_table)
	{
		$this->db = $db;
		$this->user = $user;
		$this->service_name = $service_name;
		$this->auth_provider_oauth_table = $auth_provider_oauth_table;
	}

	/**
	* {@inheritdoc}
	*/
	public function retrieveAccessToken()
	{
		if( $this->cachedToken instanceOf TokenInterface ) {
			return $this->cachedToken;
		}

		$data = array(
			'user_id'	=> $this->user->data['user_id'],
			'provider'	=> $this->service_name,
		);

		if ($this->user->data['user_id'] == ANONYMOUS)
		{
			$data['session_id']	= $this->user->data['session_id'];
		}

		return $this->_retrieve_access_token($data);
	}

	/**
	* {@inheritdoc}
	*/
	public function storeAccessToken(TokenInterface $token)
	{
		$this->cachedToken = $token;

		$data = array(
			'user_id'		=> $this->user->data['user_id'],
			'provider'		=> $this->service_name,
			'oauth_token'	=> $this->json_encode_token($token),
			'session_id'	=> $this->user->data['session_id'],
		);

		$sql = 'INSERT INTO ' . $this->auth_provider_oauth_table . '
			' . $this->db->sql_build_array('INSERT', $data);
		$this->db->sql_query($sql);
	}

	/**
	* {@inheritdoc}
	*/
	public function hasAccessToken()
	{
		if( $this->cachedToken ) {
			return true;
		}

		$data = array(
			'user_id'	=> $this->user->data['user_id'],
			'provider'	=> $this->service_name,
		);

		if ($this->user->data['user_id'] == ANONYMOUS)
		{
			$data['session_id']	= $this->user->data['session_id'];
		}

		return $this->_has_acess_token($data);
	}

	/**
	* {@inheritdoc}
	*/
	public function clearToken()
	{
		$this->cachedToken = null;

		$sql = 'DELETE FROM ' . $this->auth_provider_oauth_table . '
			WHERE user_id = ' . $this->user->data['user_id'] . '
				AND provider = \'' . $this->db->sql_escape($this->service_name) . '\'';

		if ($this->user->data['user_id'] == ANONYMOUS)
		{
			$sql .= ' AND session_id = \'' . $this->user->data['session_id'] . '\'';
		}

		$this->db->sql_query($sql);
	}

	/**
	* Updates the user_id field in the database assosciated with the token
	*
	* @param	int	$user_id
	*/
	public function set_user_id($user_id)
	{
		if (!$this->cachedToken)
		{
			return;
		}

		$sql = 'UPDATE ' . $this->auth_provider_oauth_table . '
			SET ' . $this->db->sql_build_array('UPDATE', array(
					'user_id' => (int) $user_id
				)) . '
				WHERE user_id = ' . $this->user->data['user_id'] . '
					AND session_id = \'' . $this->user->data['session_id'] . '\'';
		$this->db->sql_query($sql);
	}

	/**
	* Checks to see if an access token exists solely by the session_id of the user
	*
	* @return	bool	true if they have token, false if they don't
	*/
	public function has_access_token_by_session()
	{
		if( $this->cachedToken ) {
			return true;
		}

		$data = array(
			'session_id'	=> $this->user->data['session_id'],
			'provider'		=> $this->service_name,
		);

		return $this->_has_acess_token($data);
	}

	/**
	* A helper function that performs the query for has access token functions
	*
	* @param	array	$data
	* @return	bool
	*/
	protected function _has_acess_token($data)
	{
		$row = $this->get_access_token_row($data);

		if (!$row)
		{
			return false;
		}

		return true;
	}

	public function retrieve_access_token_by_session()
	{
		if( $this->cachedToken instanceOf TokenInterface ) {
			return $this->cachedToken;
		}

		$data = array(
			'session_id'	=> $this->user->data['session_id'],
			'provider'	=> $this->service_name,
		);

		return $this->_retrieve_access_token($data);
	}

	/**
	* A helper function that performs the query for retrieve access token functions
	* Also checks if the token is a valid token
	*
	* @param	array	$data
	* @return	mixed
	*/
	protected function _retrieve_access_token($data)
	{
		$row = $this->get_access_token_row($data);

		if (!$row)
		{
			throw new TokenNotFoundException('AUTH_PROVIDER_OAUTH_TOKEN_ERROR_NOT_STORED');
		}

		$token = $this->json_decode_token($row['oauth_token']);

		// Ensure that the token was serialized/unserialized correctly
		if (!($token instanceof TokenInterface))
		{
			$this->clearToken();
			throw new TokenNotFoundException('AUTH_PROVIDER_OAUTH_TOKEN_ERROR_INCORRECTLY_STORED');
		}

		$this->cachedToken = $token;
		return $token;
	}

	/**
	* A helper function that performs the query for retrieving an access token
	*
	* @param	array	$data
	* @return	mixed
	*/
	protected function get_access_token_row($data)
	{
		$sql = 'SELECT oauth_token FROM ' . $this->auth_provider_oauth_table . '
			WHERE ' . $this->db->sql_build_array('SELECT', $data);
		$result = $this->db->sql_query($sql);
		$row = $this->db->sql_fetchrow($result);
		$this->db->sql_freeresult($result);

		return $row;
	}

	public function json_encode_token(TokenInterface $token)
	{
		$members = array(
			'accessToken'	=> $token->getAccessToken(),
			'endOfLife'		=> $token->getEndOfLife(),
			'extraParams'	=> $token->getExtraParams(),
			'refreshToken'	=> $token->getRefreshToken(),

			'token_class'	=> get_class($token),
		);

		// Handle additional data needed for OAuth1 tokens
		if ($token instanceof StdOAuth1Token)
		{
			$members['requestToken']		= $token->getRequestToken();
			$members['requestTokenSecret']	= $token->getRequestTokenSecret();
			$members['accessTokenSecret']	= $token->getAccessTokenSecret();
		}

		return json_encode($members);
	}

	public function json_decode_token($json)
	{
		$token_data = json_decode($json, true);

		if ($token_data === null)
		{
			throw new TokenNotFoundException('Token not stored correctly');
		}

		$token_class	= $token_data['token_class'];
		$access_token	= $token_data['accessToken'];
		$refresh_token	= $token_data['refreshToken'];
		$endOfLife		= $token_data['endOfLife'];
		$extra_params	= $token_data['extraParams'];

		// Create the token
		$token = new $token_class($access_token, $refresh_token, TokenInterface::EOL_NEVER_EXPIRES, $extra_params);
		$token->setEndOfLife($endOfLife);

		// Handle OAuth 1.0 specific elements
		if ($token instanceof StdOAuth1Token)
		{
			$token->setRequestToken($token_data['requestToken']);
			$token->setRequestTokenSecret($token_data['requestTokenSecret']);
			$token->setAccessTokenSecret($token_data['accessTokenSecret']);
		}

		return $token;
	}
}
