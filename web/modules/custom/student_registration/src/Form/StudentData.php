<?php
 
namespace Drupal\student_registration\Form;
 
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Database\Database;
use Drupal\Core\Url;
use Drupal\Core\Routing;
use \Drupal\node\Entity\Node;
 
/**
 * Provides the form for adding countries.
 */
class StudentData extends FormBase {
 
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'student_form';
  }
 
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // $form_state->setMethod('GET');
    // if (isset($form_state['values']['fname'])) {
    //   $form['fname']['#default_value'] = $form_state['values']['fname'];
    // }
    // elseif (isset($parameters['fname'])) {
    //   $form['fname']['#default_value'] = $parameters['fname'];
    // }
 
    
    $form['fname'] = [
      '#type' => 'textfield',
      '#title' => $this->t('First Name'),
      '#required' => TRUE,
      '#maxlength' => 20,
      '#default_value' =>  '',
      '#id' => fname,
    ];
	 $form['sname'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Last Name'),
      '#required' => TRUE,
      '#maxlength' => 20,
      '#default_value' =>  '',
      '#id' => sname,
    ];
	$form['age'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Age'),
      '#required' => TRUE,
      '#maxlength' => 20,
      '#default_value' => '',
      '#id' => age,
    ];
	 $form['marks'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Marks'),
      '#required' => TRUE,
      '#maxlength' => 20,
      '#default_value' => '',
      '#id' => marks,
    ];
	
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#button_type' => 'primary',
      '#default_value' => $this->t('Save') ,
    ];
    $form['actions']['reset'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Reset'),
      '#submit' => array('::resetForm'),
    );
    $query = \Drupal::database()->select('students', 'u');
    $query=$query->fields('u', ['id','fname','sname','age','marks']);
    $results = $query->execute()->fetchAll();
    $rows =[];
    foreach($results as $key=>$value){
      $rows['id']=$value->id;
      $rows['firstname']=$value->fname;
      $rows['surname']=$value->sname;
      $rows['Age']=$value->age;
      $rows['Marks']=$value->marks;
      $rows[] = $rows;
    };
    $header = [
      'id' => t('id'),
      'firstname' => t('fname'),
      'surname' => t('sname'),
      'Age' => t('Age'),
      'Marks' => t('Marks'),
    ];
    $form['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#empty' => t('No users found'),
      ];
	//$form['#validate'][] = 'studentFormValidate';
 
    return $form;
 
  }
  
   /**
   * {@inheritdoc}
   */
  public function validateForm(array & $form, FormStateInterface $form_state) {
       $field = $form_state->getValues();
	   
		$fields["fname"] = $field['fname'];
		if (!$form_state->getValue('fname') || empty($form_state->getValue('fname'))) {
            $form_state->setErrorByName('fname', $this->t('Provide First Name'));
        }
		
		
  }
 
  /**
   * {@inheritdoc}
   */
  public function submitForm(array & $form, FormStateInterface $form_state) {
	try{
		// $conn = Database::getConnection();
    $dataa = [
      'field_address' => $form_state->getValue('sname'), 
    ];
    $node = \Drupal::entityTypeManager()
      ->getStorage('resume_form')
      ->create($dataa);
    $node->save();
		
		$field = $form_state->getValues();
	   
		$fields["fname"] = $field['fname'];
		$fields["sname"] = $field['sname'];
		$fields["age"] = $field['age'];
		$fields["marks"] = $field['marks'];
		
		  $conn->insert('students')
			   ->fields($fields)->execute();
		  \Drupal::messenger()->addMessage($this->t('The Student data has been succesfully saved'));
		 
	} catch(Exception $ex){
		\Drupal::logger('dn_students')->error($ex->getMessage());
	}
    
  }
 
}