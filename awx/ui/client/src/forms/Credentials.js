/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

 /**
 * @ngdoc function
 * @name forms.function:Credentials
 * @description This form is for adding/editing a Credential
*/

export default
    angular.module('CredentialFormDefinition', [])
        .factory('CredentialForm', ['i18n', function(i18n) {
        return {

            addTitle: i18n._('Create Credential'), //Legend in add mode
            editTitle: '{{ name }}', //Legend in edit mode
            name: 'credential',
            // the top-most node of generated state tree
            stateTree: 'credentials',
            forceListeners: true,
            subFormTitles: {
                credentialSubForm: i18n._('Type Details'),
            },

            actions: {

            },

            fields: {
                name: {
                    label: i18n._('Name'),
                    type: 'text',
                    required: true,
                    autocomplete: false,
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                description: {
                    label: i18n._('Description'),
                    type: 'text',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                organization: {
                    // interpolated with $rootScope
                    basePath: "{{$rootScope.current_user.is_superuser ? 'api/v1/organizations' : $rootScope.current_user.url + 'admin_of_organizations'}}",
                    ngShow: 'canShareCredential',
                    label: i18n._('Organization'),
                    type: 'lookup',
                    list: 'OrganizationList',
                    sourceModel: 'organization',
                    sourceField: 'name',
                    awPopOver: i18n._("<p>If no organization is given, the credential can only be used by the user that creates the credential.  Organization admins and system administrators can assign an organization so that roles for the credential can be assigned to users and teams in that organization.</p>"),
                    dataTitle: i18n._('Organization') + ' ',
                    dataPlacement: 'bottom',
                    dataContainer: "body",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                kind: {
                    label: i18n._('Type'),
                    excludeModal: true,
                    type: 'select',
                    ngOptions: 'kind.label for kind in credential_kind_options track by kind.value', //  select as label for value in array 'kind.label for kind in credential_kind_options',
                    ngChange: 'kindChange()',
                    required: true,
                    awPopOver: i18n._('<dl>\n' +
                            '<dt>Machine</dt>\n' +
                            '<dd>Authentication for remote machine access. This can include SSH keys, usernames, passwords, ' +
                            'and sudo information. Machine credentials are used when submitting jobs to run playbooks against ' +
                            'remote hosts.</dd>' +
                            '<dt>Network</dt>\n' +
                            '<dd>Authentication for network device access. This can include SSH keys, usernames, passwords, ' +
                            'and authorize information. Network credentials are used when submitting jobs to run playbooks against ' +
                            'network devices.</dd>' +
                            '<dt>Source Control</dt>\n' +
                            '<dd>Used to check out and synchronize playbook repositories with a remote source control ' +
                            'management system such as Git, Subversion (svn), or Mercurial (hg). These credentials are ' +
                            'used by Projects.</dd>\n' +
                            '<dt>Others (Cloud Providers)</dt>\n' +
                            '<dd>Usernames, passwords, and access keys for authenticating to the specified cloud or infrastructure ' +
                            'provider. These are used for dynamic inventory sources and for cloud provisioning and deployment ' +
                            'in playbook runs.</dd>\n' +
                            '</dl>\n'),
                    dataTitle: i18n._('Type'),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    hasSubForm: true,
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                access_key: {
                    label: i18n._('Access Key'),
                    type: 'text',
                    ngShow: "kind.value == 'aws'",
                    awRequiredWhen: {
                        reqExpression: "aws_required",
                        init: false
                    },
                    autocomplete: false,
                    apiField: 'username',
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                secret_key: {
                    label: i18n._('Secret Key'),
                    type: 'sensitive',
                    ngShow: "kind.value == 'aws'",
                    ngDisabled: "secret_key_ask || !(credential_obj.summary_fields.user_capabilities.edit || canAdd)",
                    awRequiredWhen: {
                        reqExpression: "aws_required",
                        init: false
                    },
                    autocomplete: false,
                    clear: false,
                    hasShowInputButton: true,
                    apiField: 'password',
                    subForm: 'credentialSubForm'
                },
                security_token: {
                    label: i18n._('STS Token'),
                    type: 'sensitive',
                    ngShow: "kind.value == 'aws'",
                    autocomplete: false,
                    apiField: 'security_token',
                    awPopOver: i18n._("<div>Security Token Service (STS) is a web service that enables you to request temporary, limited-privilege credentials for AWS Identity and Access Management (IAM) users.</div><div style='padding-top: 10px'>To learn more about the IAM STS Token, refer to the <a href='http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html' target='_blank'>Amazon documentation</a>.</div>"),
                    hasShowInputButton: true,
                    dataTitle: i18n._('STS Token'),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "host": {
                    labelBind: 'hostLabel',
                    type: 'text',
                    ngShow: "kind.value == 'vmware' || kind.value == 'openstack' || kind.value === 'satellite6' || kind.value === 'cloudforms'",
                    awPopOverWatch: "hostPopOver",
                    awPopOver: i18n._("set in helpers/credentials"),
                    dataTitle: i18n._('Host'),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    autocomplete: false,
                    awRequiredWhen: {
                        reqExpression: 'host_required',
                        init: false
                    },
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "subscription": {
                    label: i18n._("Subscription ID"),
                    type: 'text',
                    ngShow: "kind.value == 'azure' || kind.value == 'azure_rm'",
                    awRequiredWhen: {
                        reqExpression: 'subscription_required',
                        init: false
                    },


                    autocomplete: false,
                    awPopOver: i18n._('<p>Subscription ID is an Azure construct, which is mapped to a username.</p>'),
                    dataTitle: i18n._('Subscription ID'),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "username": {
                    labelBind: 'usernameLabel',
                    type: 'text',
                    ngShow: "kind.value && kind.value !== 'aws' && " +
                            "kind.value !== 'gce' && kind.value!=='azure'",
                    awRequiredWhen: {
                        reqExpression: 'username_required',
                        init: false
                    },
                    autocomplete: false,
                    subForm: "credentialSubForm",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "email_address": {
                    labelBind: 'usernameLabel',
                    type: 'email',
                    ngShow: "kind.value === 'gce'",
                    awRequiredWhen: {
                        reqExpression: 'email_required',
                        init: false
                    },
                    autocomplete: false,
                    awPopOver: i18n._('<p>The email address assigned to the Google Compute Engine <b><i>service account.</b></i></p>'),
                    dataTitle: i18n._('Email'),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "api_key": {
                    label: i18n._('API Key'),
                    type: 'sensitive',
                    ngShow: "kind.value == 'rax'",
                    awRequiredWhen: {
                        reqExpression: "rackspace_required",
                        init: false
                    },
                    autocomplete: false,
                    hasShowInputButton: true,
                    clear: false,
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "password": {
                    labelBind: 'passwordLabel',
                    type: 'sensitive',
                    ngShow: "kind.value == 'scm' || kind.value == 'vmware' || kind.value == 'openstack'|| kind.value == 'satellite6'|| kind.value == 'cloudforms'|| kind.value == 'net' || kind.value == 'azure_rm'",
                    clear: false,
                    autocomplete: false,
                    hasShowInputButton: true,
                    awRequiredWhen: {
                        reqExpression: "password_required",
                        init: false
                    },
                    subForm: "credentialSubForm",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "ssh_password": {
                    label: i18n._('Password'),
                    type: 'sensitive',
                    ngShow: "kind.value == 'ssh'",
                    ngDisabled: "ssh_password_ask || !(credential_obj.summary_fields.user_capabilities.edit || canAdd)",
                    subCheckbox: {
                        variable: 'ssh_password_ask',
                        text: i18n._('Ask at runtime?'),
                        ngChange: 'ask(\'ssh_password\', \'undefined\')'
                    },
                    hasShowInputButton: true,
                    autocomplete: false,
                    subForm: 'credentialSubForm'
                },
                "ssh_key_data": {
                    labelBind: 'sshKeyDataLabel',
                    type: 'textarea',
                    ngShow: "kind.value == 'ssh' || kind.value == 'scm' || " +
                            "kind.value == 'gce' || kind.value == 'azure' || kind.value == 'net'",
                    awRequiredWhen: {
                        reqExpression: 'key_required',
                        init: true
                    },
                    class: 'Form-textAreaLabel Form-formGroup--fullWidth',
                    elementClass: 'Form-monospace',


                    awDropFile: true,
                    rows: 10,
                    awPopOver: i18n._("SSH key description"),
                    awPopOverWatch:   "key_description",
                    dataTitle: i18n._('Private Key'),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    subForm: "credentialSubForm",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "ssh_key_unlock": {
                    label: i18n._('Private Key Passphrase'),
                    type: 'sensitive',
                    ngShow: "kind.value == 'ssh' || kind.value == 'scm'",
                    ngDisabled: "keyEntered === false || ssh_key_unlock_ask || !(credential_obj.summary_fields.user_capabilities.edit || canAdd)",
                    subCheckbox: {
                        variable: 'ssh_key_unlock_ask',
                        ngShow: "kind.value == 'ssh'",
                        text: i18n._('Ask at runtime?'),
                        ngChange: 'ask(\'ssh_key_unlock\', \'undefined\')',
                        ngDisabled: "keyEntered === false"
                    },
                    hasShowInputButton: true,
                    subForm: 'credentialSubForm'
                },
                "become_method": {
                    label: i18n._("Privilege Escalation"),
                    // hintText: "If your playbooks use privilege escalation (\"sudo: true\", \"su: true\", etc), you can specify the username to become, and the password to use here.",
                    type: 'select',
                    ngShow: "kind.value == 'ssh'",
                    dataTitle: i18n._('Privilege Escalation'),
                    ngOptions: 'become.label for become in become_options track by become.value',
                    awPopOver: i18n._("<p>Specify a method for 'become' operations. " +
                    "This is equivalent to specifying the <code>--become-method=BECOME_METHOD</code> parameter, where <code>BECOME_METHOD</code> could be "+
                    "<code>sudo | su | pbrun | pfexec | runas</code> <br>(defaults to <code>sudo</code>)</p>"),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "become_username": {
                    labelBind: 'becomeUsernameLabel',
                    type: 'text',
                    ngShow: "(kind.value == 'ssh' && (become_method && become_method.value)) ",


                    autocomplete: false,
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "become_password": {
                    labelBind: 'becomePasswordLabel',
                    type: 'sensitive',
                    ngShow: "(kind.value == 'ssh' && (become_method && become_method.value)) ",
                    ngDisabled: "become_password_ask || !(credential_obj.summary_fields.user_capabilities.edit || canAdd)",
                    subCheckbox: {
                        variable: 'become_password_ask',
                        text: i18n._('Ask at runtime?'),
                        ngChange: 'ask(\'become_password\', \'undefined\')'
                    },
                    hasShowInputButton: true,
                    autocomplete: false,
                    subForm: 'credentialSubForm'
                },
                client:{
                    type: 'text',
                    label: i18n._('Client ID'),
                    subForm: 'credentialSubForm',
                    ngShow: "kind.value === 'azure_rm'",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                secret:{
                    type: 'sensitive',
                    hasShowInputButton: true,
                    autocomplete: false,
                    label: i18n._('Client Secret'),
                    subForm: 'credentialSubForm',
                    ngShow: "kind.value === 'azure_rm'",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                tenant: {
                    type: 'text',
                    label: i18n._('Tenant ID'),
                    subForm: 'credentialSubForm',
                    ngShow: "kind.value === 'azure_rm'",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                authorize: {
                    label: i18n._('Authorize'),
                    type: 'checkbox',
                    ngChange: "toggleCallback('host_config_key')",
                    subForm: 'credentialSubForm',
                    ngShow: "kind.value === 'net'",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                authorize_password: {
                    label: i18n._('Authorize Password'),
                    type: 'sensitive',
                    hasShowInputButton: true,
                    autocomplete: false,
                    subForm: 'credentialSubForm',
                    ngShow: "authorize && authorize !== 'false'",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "project": {
                    labelBind: 'projectLabel',
                    type: 'text',
                    ngShow: "kind.value == 'gce' || kind.value == 'openstack'",
                    awPopOverWatch: "projectPopOver",
                    awPopOver: i18n._("set in helpers/credentials"),
                    dataTitle: i18n._('Project Name'),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    awRequiredWhen: {
                        reqExpression: 'project_required',
                        init: false
                    },
                    subForm: 'credentialSubForm',
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                "domain": {
                    labelBind: 'domainLabel',
                    type: 'text',
                    ngShow: "kind.value == 'openstack'",
                    awPopOver: i18n._("<p>OpenStack domains define administrative " +
                    "boundaries. It is only needed for Keystone v3 authentication URLs. " +
                    "Common scenarios include:<ul><li><b>v2 URLs</b> - leave blank</li>" +
                    "<li><b>v3 default</b> - set to 'default'</br></li>" +
                    "<li><b>v3 multi-domain</b> - your domain name</p></li></ul></p>"),
                    dataTitle: i18n._('Domain Name'),
                    dataPlacement: 'right',
                    dataContainer: "body",
                    ngDisabled: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)',
                    subForm: 'credentialSubForm'
                },
                "vault_password": {
                    label: i18n._("Vault Password"),
                    type: 'sensitive',
                    ngShow: "kind.value == 'ssh'",
                    ngDisabled: "vault_password_ask || !(credential_obj.summary_fields.user_capabilities.edit || canAdd)",
                    subCheckbox: {
                        variable: 'vault_password_ask',
                        text: i18n._('Ask at runtime?'),
                        ngChange: 'ask(\'vault_password\', \'undefined\')'
                    },
                    hasShowInputButton: true,
                    autocomplete: false,
                    subForm: 'credentialSubForm'
                }
            },

            buttons: {
                cancel: {
                    ngClick: 'formCancel()',
                    ngShow: '(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                close: {
                    ngClick: 'formCancel()',
                    ngShow: '!(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                },
                save: {
                    label: 'Save',
                    ngClick: 'formSave()', //$scope.function to call on click, optional
                    ngDisabled: true,
                    ngShow: '(credential_obj.summary_fields.user_capabilities.edit || !canAdd)' //Disable when $pristine or $invalid, optional
                }
            },

            related: {
                permissions: {
                    disabled: 'disablePermissionAssignment',
                    awToolTip: '{{permissionsTooltip}}',
                    dataTipWatch: 'permissionsTooltip',
                    dataPlacement: 'top',
                    basePath: 'api/v1/credentials/{{$stateParams.credential_id}}/access_list/',
                    search: {
                        order_by: 'username'
                    },
                    type: 'collection',
                    title: i18n._('Permissions'),
                    iterator: 'permission',
                    index: false,
                    open: false,
                    actions: {
                        add: {
                            ngClick: "$state.go('.add')",
                            label: 'Add',
                            awToolTip: i18n._('Add a permission'),
                            actionClass: 'btn List-buttonSubmit',
                            buttonContent: i18n._('&#43; ADD'),
                            ngShow: '(credential_obj.summary_fields.user_capabilities.edit || !canAdd)'
                        }
                    },
                    fields: {
                        username: {
                            key: true,
                            label: i18n._('User'),
                            linkBase: 'users',
                            class: 'col-lg-3 col-md-3 col-sm-3 col-xs-4'
                        },
                        role: {
                            label: i18n._('Role'),
                            type: 'role',
                            noSort: true,
                            class: 'col-lg-4 col-md-4 col-sm-4 col-xs-4',
                            searchable: false
                        },
                        team_roles: {
                            label: i18n._('Team Roles'),
                            type: 'team_roles',
                            noSort: true,
                            class: 'col-lg-5 col-md-5 col-sm-5 col-xs-4',
                            searchable: false
                        }
                    }
                }
            },

            relatedSets: function(urls) {
                return {
                    permissions: {
                        iterator: 'permission',
                        url: urls.access_list,
                    }
                };
            }
        };}]);
